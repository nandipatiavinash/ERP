interface JournalEntry {
  account_name: string;
  entry_type: "debit" | "credit";
  amount: number;
  entry_date: string;
}

export function computeFifoAging(entries: JournalEntry[], targetType: "receivable" | "payable", toDateStr: string) {
  // Group entries by account name
  const accountMap = new Map<string, JournalEntry[]>();
  entries.forEach((e) => {
    if (e.entry_date <= toDateStr) {
      const list = accountMap.get(e.account_name) || [];
      list.push(e);
      accountMap.set(e.account_name, list);
    }
  });

  const agingList: Array<{ accountName: string; balance: number; maxDays: number }> = [];

  for (const [accountName, list] of accountMap.entries()) {
    // Sort chronologically
    list.sort((a, b) => a.entry_date.localeCompare(b.entry_date));

    // Calculate total net balance
    let netBalance = 0;
    list.forEach((e) => {
      if (e.entry_type === "debit") {
        netBalance += Number(e.amount || 0);
      } else {
        netBalance -= Number(e.amount || 0);
      }
    });

    if (targetType === "receivable" && netBalance > 0.01) {
      // Dr. Balance: Customer owes us money.
      // We want to age the outstanding debits. We apply credits to offset oldest debits first.
      const debits = list.filter((e) => e.entry_type === "debit");
      const credits = list.filter((e) => e.entry_type === "credit");
      let totalCredit = credits.reduce((sum, c) => sum + Number(c.amount || 0), 0);

      // Offset debits
      const outstandingDebits: typeof debits = [];
      debits.forEach((d) => {
        const dAmt = Number(d.amount || 0);
        if (totalCredit >= dAmt) {
          totalCredit -= dAmt;
        } else if (totalCredit > 0) {
          outstandingDebits.push({ ...d, amount: dAmt - totalCredit });
          totalCredit = 0;
        } else {
          outstandingDebits.push(d);
        }
      });

      if (outstandingDebits.length > 0) {
        // Calculate max age in days from bill date (entry_date) to toDate
        const toDate = new Date(toDateStr + "T00:00:00");
        let maxDays = 0;
        outstandingDebits.forEach((d) => {
          const dDate = new Date(d.entry_date + "T00:00:00");
          const diffTime = toDate.getTime() - dDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays > maxDays) maxDays = diffDays;
        });

        agingList.push({
          accountName,
          balance: netBalance,
          maxDays: Math.max(0, maxDays),
        });
      }
    } else if (targetType === "payable" && netBalance < -0.01) {
      // Cr. Balance: We owe supplier money.
      // We want to age outstanding credits. We apply debits to offset oldest credits.
      const credits = list.filter((e) => e.entry_type === "credit");
      const debits = list.filter((e) => e.entry_type === "debit");
      let totalDebit = debits.reduce((sum, d) => sum + Number(d.amount || 0), 0);

      const outstandingCredits: typeof credits = [];
      credits.forEach((c) => {
        const cAmt = Number(c.amount || 0);
        if (totalDebit >= cAmt) {
          totalDebit -= cAmt;
        } else if (totalDebit > 0) {
          outstandingCredits.push({ ...c, amount: cAmt - totalDebit });
          totalDebit = 0;
        } else {
          outstandingCredits.push(c);
        }
      });

      if (outstandingCredits.length > 0) {
        const toDate = new Date(toDateStr + "T00:00:00");
        let maxDays = 0;
        outstandingCredits.forEach((c) => {
          const cDate = new Date(c.entry_date + "T00:00:00");
          const diffTime = toDate.getTime() - cDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays > maxDays) maxDays = diffDays;
        });

        agingList.push({
          accountName,
          balance: Math.abs(netBalance),
          maxDays: Math.max(0, maxDays),
        });
      }
    }
  }

  // Sort by number of days descending (highest first)
  return agingList.sort((a, b) => b.maxDays - a.maxDays);
}

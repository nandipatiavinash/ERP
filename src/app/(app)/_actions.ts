"use server";

import * as master from "./_actions/master";
import * as attendance from "./_actions/attendance";
import * as production from "./_actions/production";
import * as sales from "./_actions/sales";
import * as purchases from "./_actions/purchases";
import * as usersRoles from "./_actions/users-roles";
import * as rawMaterials from "./_actions/raw-materials";
import * as products from "./_actions/products";
import * as journal from "./_actions/journal";
import * as accounts from "./_actions/accounts";
import * as clientOrders from "./_actions/client-orders";
import * as dailyData from "./_actions/daily-data";
import * as dashboard from "./_actions/dashboard";

// Master Actions
export async function saveMaster(moduleKey: string, formData: FormData) {
  return master.saveMaster(moduleKey, formData);
}
export async function deactivateMaster(moduleKey: string, formData: FormData) {
  return master.deactivateMaster(moduleKey, formData);
}

// Attendance Actions
export async function checkInAttendance(formData: FormData) {
  return attendance.checkInAttendance(formData);
}
export async function checkOutAttendance(formData: FormData) {
  return attendance.checkOutAttendance(formData);
}
export async function linkEmployeeUser(formData: FormData) {
  return attendance.linkEmployeeUser(formData);
}

// Production Actions
export async function saveProduction(formData: FormData) {
  return production.saveProduction(formData);
}
export async function softDeleteProduction(formData: FormData) {
  return production.softDeleteProduction(formData);
}
export async function saveRotoFilmProduction(formData: FormData) {
  return production.saveRotoFilmProduction(formData);
}
export async function deleteRotoFilmProduction(id: string) {
  return production.deleteRotoFilmProduction(id);
}
export async function saveRotoMetallicProduction(formData: FormData) {
  return production.saveRotoMetallicProduction(formData);
}
export async function deleteRotoMetallicProduction(id: string) {
  return production.deleteRotoMetallicProduction(id);
}
export async function saveLaminationProduction(formData: FormData) {
  return production.saveLaminationProduction(formData);
}
export async function deleteLaminationProduction(id: string) {
  return production.deleteLaminationProduction(id);
}
export async function saveOffsetProduction(formData: FormData) {
  return production.saveOffsetProduction(formData);
}
export async function deleteOffsetProduction(id: string) {
  return production.deleteOffsetProduction(id);
}
export async function saveFinishingBundle(formData: FormData) {
  return production.saveFinishingBundle(formData);
}
export async function deleteFinishingBundle(id: string) {
  return production.deleteFinishingBundle(id);
}
export async function saveStageProduction(formData: FormData) {
  return production.saveStageProduction(formData);
}
export async function softDeleteStageProduction(formData: FormData) {
  return production.softDeleteStageProduction(formData);
}

// Sales Actions
export async function saveSale(formData: FormData) {
  return sales.saveSale(formData);
}
export async function createSalesOrder(formData: FormData) {
  return sales.createSalesOrder(formData);
}
export async function deleteSalesOrderItem(itemId: string) {
  return sales.deleteSalesOrderItem(itemId);
}
export async function updateSalesOrderItemJobwork(formData: FormData) {
  return sales.updateSalesOrderItemJobwork(formData);
}
export async function confirmSalesDelivery(
  orderId: string,
  itemRolls: Record<string, string[]>,
  itemRemainingActions?: Record<string, "backorder" | "close">
) {
  return sales.confirmSalesDelivery(orderId, itemRolls, itemRemainingActions);
}
export async function prepareSalesOrderDraftBilling(formData: FormData) {
  return sales.prepareSalesOrderDraftBilling(formData);
}
export async function finalizeSalesOrderBilling(formData: FormData) {
  return sales.finalizeSalesOrderBilling(formData);
}
export async function discardSalesOrderDraftBilling(orderId: string) {
  return sales.discardSalesOrderDraftBilling(orderId);
}
export async function deleteSalesOrderCompletely(orderId: string) {
  return sales.deleteSalesOrderCompletely(orderId);
}
export async function saveSalesConfirmationRates(
  orderId: string,
  itemPrices: Record<string, number>,
  gstRate: number
) {
  return sales.saveSalesConfirmationRates(orderId, itemPrices, gstRate);
}
export async function saveMaterialSalesEntry(formData: FormData) {
  return sales.saveMaterialSalesEntry(formData);
}
export async function deleteMaterialSalesEntry(formData: FormData) {
  return sales.deleteMaterialSalesEntry(formData);
}
export async function confirmMultipleSalesDeliveries(
  selectedItemIds: string[],
  itemRolls: Record<string, string[]>,
  itemRemainingActions: Record<string, "backorder" | "close">,
  deliveryDate?: string
) {
  return sales.confirmMultipleSalesDeliveries(selectedItemIds, itemRolls, itemRemainingActions, deliveryDate);
}
export async function saveSalesOrderBillingDirect(formData: FormData) {
  return sales.saveSalesOrderBillingDirect(formData);
}

// Purchases Actions
export async function saveRawMaterialPurchase(formData: FormData) {
  return purchases.saveRawMaterialPurchase(formData);
}
export async function deleteRawMaterialPurchase(id: string) {
  return purchases.deleteRawMaterialPurchase(id);
}

export async function createErpUser(state: unknown, formData: FormData) {
  return usersRoles.createErpUser(state, formData);
}
export async function changeUserPassword(formData: FormData) {
  return usersRoles.changeUserPassword(formData);
}
export async function deleteErpUser(userId: string) {
  return usersRoles.deleteErpUser(userId);
}
export async function createRole(formData: FormData) {
  return usersRoles.createRole(formData);
}
export async function saveRoleDetails(formData: FormData) {
  return usersRoles.saveRoleDetails(formData);
}
export async function saveRolePermissions(formData: FormData) {
  return usersRoles.saveRolePermissions(formData);
}
export async function deactivateRole(formData: FormData) {
  return usersRoles.deactivateRole(formData);
}

// Raw Materials Actions
export async function updateCriticalLevel(formData: FormData) {
  return rawMaterials.updateCriticalLevel(formData);
}
export async function saveRawMaterialConsumption(formData: FormData) {
  return rawMaterials.saveRawMaterialConsumption(formData);
}
export async function softDeleteRawMaterialConsumption(formData: FormData) {
  return rawMaterials.softDeleteRawMaterialConsumption(formData);
}
export async function consumeFabricRoll(rollId: string, stage: string) {
  return rawMaterials.consumeFabricRoll(rollId, stage);
}
export async function revertFabricRollConsumption(rollId: string) {
  return rawMaterials.revertFabricRollConsumption(rollId);
}
export async function consumeMetallicRoll(rollId: string) {
  return rawMaterials.consumeMetallicRoll(rollId);
}
export async function revertMetallicRollConsumption(rollId: string) {
  return rawMaterials.revertMetallicRollConsumption(rollId);
}
export async function consumeRotoFilmRoll(rollId: string) {
  return rawMaterials.consumeRotoFilmRoll(rollId);
}
export async function revertRotoFilmRollConsumption(rollId: string) {
  return rawMaterials.revertRotoFilmRollConsumption(rollId);
}
export async function consumeLaminationRoll(rollId: string, stage?: string) {
  return rawMaterials.consumeLaminationRoll(rollId, stage);
}
export async function revertLaminationRollConsumption(rollId: string, stage?: string) {
  return rawMaterials.revertLaminationRollConsumption(rollId, stage);
}
export async function consumeOffsetRoll(rollId: string) {
  return rawMaterials.consumeOffsetRoll(rollId);
}
export async function revertOffsetRollConsumption(rollId: string) {
  return rawMaterials.revertOffsetRollConsumption(rollId);
}

// Products Actions
export async function saveRotoProduct(formData: FormData) {
  return products.saveRotoProduct(formData);
}
export async function deactivateRotoProduct(formData: FormData) {
  return products.deactivateRotoProduct(formData);
}
export async function saveOffsetProduct(formData: FormData) {
  return products.saveOffsetProduct(formData);
}
export async function deactivateOffsetProduct(formData: FormData) {
  return products.deactivateOffsetProduct(formData);
}
export async function saveCatalogProduct(formData: FormData) {
  return products.saveCatalogProduct(formData);
}
export async function deleteCatalogProduct(id: string, category: string) {
  return products.deleteCatalogProduct(id, category);
}

// Journal Actions
export async function saveJournalEntry(formData: FormData) {
  return journal.saveJournalEntry(formData);
}
export async function softDeleteJournalEntryGroup(formData: FormData) {
  return journal.softDeleteJournalEntryGroup(formData);
}

// Accounts Actions
export async function saveAccountOpeningBalance(formData: FormData) {
  return accounts.saveAccountOpeningBalance(formData);
}
export async function saveClosingStock(
  date: string,
  customPrices: Record<string, number>,
  baseTotal: number,
  wipAmount: number,
  gstAmount: number,
  grandTotal: number
) {
  return accounts.saveClosingStock(date, customPrices, baseTotal, wipAmount, gstAmount, grandTotal);
}
export async function saveProfitLoss(
  date: string,
  manualExpenses: number,
  netProfit: number,
  netLoss: number
) {
  return accounts.saveProfitLoss(date, manualExpenses, netProfit, netLoss);
}
export async function clearSystemTransactions() {
  return accounts.clearSystemTransactions();
}

export async function approveClientOrder(clientOrderId: string) {
  return clientOrders.approveClientOrder(clientOrderId);
}

export async function cancelClientOrder(clientOrderId: string) {
  return clientOrders.cancelClientOrder(clientOrderId);
}

// Daily Data Actions
export async function saveTapeLineEntry(formData: FormData) {
  return dailyData.saveTapeLineEntry(formData);
}
export async function deleteTapeLineEntry(formData: FormData) {
  return dailyData.deleteTapeLineEntry(formData);
}
export async function saveLoomShiftMeters(formData: FormData) {
  return dailyData.saveLoomShiftMeters(formData);
}
export async function deleteLoomShiftMeters(formData: FormData) {
  return dailyData.deleteLoomShiftMeters(formData);
}
export async function saveElectricityUnits(formData: FormData) {
  return dailyData.saveElectricityUnits(formData);
}
export async function deleteElectricityUnits(formData: FormData) {
  return dailyData.deleteElectricityUnits(formData);
}
export async function saveDailyWasteEntry(formData: FormData) {
  return dailyData.saveDailyWasteEntry(formData);
}
export async function deleteDailyWasteEntry(formData: FormData) {
  return dailyData.deleteDailyWasteEntry(formData);
}

export async function closeOperatorOrderItem(itemId: string, department: string) {
  return dashboard.closeOperatorOrderItem(itemId, department);
}




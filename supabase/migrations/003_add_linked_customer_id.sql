-- Add linked_customer_id to customers table
ALTER TABLE public.customers ADD COLUMN linked_customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL;

/* Safely migrate any journal entries from suffix accounts to parent accounts
UPDATE public.accounts_journal
SET account_id = '6230c75e-3538-4585-81b0-6f2e4dc5a655', account_name = 'SREE NAGANATHA PLASTICS'
WHERE account_id = '27cbfc61-4a3f-4a3c-a59f-10329c6b1d3e';

UPDATE public.accounts_journal
SET account_id = '6ae1db4e-9713-47e5-8950-79960f6bfb32', account_name = 'PRESTINE VENTURES P LTD'
WHERE account_id = 'ed72dcc7-be75-407c-8202-6c053d3d93c8';

UPDATE public.accounts_journal
SET account_id = '1a0694fe-85c0-49b6-a757-7ebd01861909', account_name = 'JK PLASTICS'
WHERE account_id = '731ca0b5-e209-4f6a-857c-befd02cc0380';

-- Delete the old auto-generated suffix accounts
DELETE FROM public.customers
WHERE id IN (
  '27cbfc61-4a3f-4a3c-a59f-10329c6b1d3e', 
  'ed72dcc7-be75-407c-8202-6c053d3d93c8', 
  '731ca0b5-e209-4f6a-857c-befd02cc0380'
);

-- Insert new independent client accounts representing the alias accounts, linked to their parent accounts
INSERT INTO public.customers (customer_name, is_internal, linked_customer_id, status) VALUES
('JAYKUMAR', 'client a/c', '1a0694fe-85c0-49b6-a757-7ebd01861909', 'active'),
('SANDEEP PV', 'client a/c', '6ae1db4e-9713-47e5-8950-79960f6bfb32', 'active'),
('GOPAL', 'client a/c', '6230c75e-3538-4585-81b0-6f2e4dc5a655', 'active'),
('MANIKANTA', 'client a/c', '93a414af-ab3c-4d94-b03d-3ff3dbbeca19', 'active'),
('KIRAN-K', 'client a/c', '04d7e466-88a4-41a3-8094-05929952d673', 'active'),
('KIRAN-V', 'client a/c', '928a3f3b-4d26-423a-bcc2-072cee7e22f5', 'active');
*/

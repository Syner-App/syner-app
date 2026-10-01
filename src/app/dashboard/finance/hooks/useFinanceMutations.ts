"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { closePeriodAction } from "@/app/dashboard/finance/actions/closePeriodAction"
import { createCreditAction } from "@/app/dashboard/finance/actions/createCreditAction"
import { createRecipeAction } from "@/app/dashboard/finance/actions/createRecipeAction"
import { payExpenseAction } from "@/app/dashboard/finance/actions/payExpenseAction"
import { payInstallmentAction } from "@/app/dashboard/finance/actions/payInstallmentAction"
import { payPayableAction } from "@/app/dashboard/finance/actions/payPayableAction"
import { prepayCreditAction } from "@/app/dashboard/finance/actions/prepayCreditAction"
import { registerContributionAction } from "@/app/dashboard/finance/actions/registerContributionAction"
import { registerExpenseAction } from "@/app/dashboard/finance/actions/registerExpenseAction"
import { registerSaleAction } from "@/app/dashboard/finance/actions/registerSaleAction"
import { registerWithdrawalAction } from "@/app/dashboard/finance/actions/registerWithdrawalAction"
import { reopenPeriodAction } from "@/app/dashboard/finance/actions/reopenPeriodAction"
import { retrySaleStockAction } from "@/app/dashboard/finance/actions/retrySaleStockAction"
import { setAssumptionsAction } from "@/app/dashboard/finance/actions/setAssumptionsAction"
import { transferReserveAction } from "@/app/dashboard/finance/actions/transferReserveAction"
import { updatePolicyAction } from "@/app/dashboard/finance/actions/updatePolicyAction"
import { updateRecipeAction } from "@/app/dashboard/finance/actions/updateRecipeAction"
import { upsertSupplyAction } from "@/app/dashboard/finance/actions/upsertSupplyAction"
import { FINANCE_KEY } from "@/app/dashboard/finance/utils/keys"
import { formatMoney, formatPeriod } from "@/lib/format"
import { ALERTS_KEY } from "@/app/dashboard/alerts/hooks/useAlerts"
import { PRODUCTS_KEY } from "@/app/dashboard/products/hooks/useProducts"

// A finance mutation that refreshes every finance query and toasts `success`. `stock` also
// refreshes products and alerts (sales discount supplies from products-ms)
function useFinanceMutation<TVariables, TResult>(
  mutationFn: (variables: TVariables) => Promise<TResult>,
  success: (result: TResult) => string,
  { stock = false }: { stock?: boolean } = {}
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: FINANCE_KEY })
      if (stock) {
        void queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
        void queryClient.invalidateQueries({ queryKey: ALERTS_KEY })
      }
      toast.success(success(result))
    },
  })
}

export const useRegisterSale = () =>
  useFinanceMutation(registerSaleAction, (sale) => `Venta de ${formatMoney(sale.total)} registrada`, { stock: true })

export const useRetrySaleStock = () =>
  useFinanceMutation(retrySaleStockAction, () => "Descuento de stock enviado de nuevo", { stock: true })

export const useUpsertSupply = () => useFinanceMutation(upsertSupplyAction, (supply) => `Insumo ${supply.nombre} guardado`)

export const useCreateRecipe = () => useFinanceMutation(createRecipeAction, (recipe) => `Receta ${recipe.nombre} creada`)

export const useUpdateRecipe = () =>
  useFinanceMutation(updateRecipeAction, (recipe) => `Receta ${recipe.nombre} actualizada`)

export const usePayPayable = () => useFinanceMutation(payPayableAction, () => "Cuenta pagada")

export const useCreateCredit = () => useFinanceMutation(createCreditAction, (credit) => `Crédito ${credit.nombre} creado`)

export const usePayInstallment = () => useFinanceMutation(payInstallmentAction, () => "Cuota registrada")

export const usePrepayCredit = () => useFinanceMutation(prepayCreditAction, () => "Abono extraordinario registrado")

export const useRegisterExpense = () =>
  useFinanceMutation(registerExpenseAction, (movement) => `Gasto de ${formatMoney(movement.monto)} registrado`)

export const usePayExpense = () => useFinanceMutation(payExpenseAction, () => "Gasto pagado")

export const useRegisterContribution = () =>
  useFinanceMutation(registerContributionAction, (movement) => `Aporte de ${formatMoney(movement.monto)} registrado`)

export const useTransferReserve = () => useFinanceMutation(transferReserveAction, () => "Traslado registrado")

export const useRegisterWithdrawal = () =>
  useFinanceMutation(registerWithdrawalAction, (movement) => `Retiro de ${formatMoney(movement.monto)} registrado`)

export const useSetAssumptions = () => useFinanceMutation(setAssumptionsAction, () => "Supuestos guardados")

export const useUpdatePolicy = () => useFinanceMutation(updatePolicyAction, () => "Política financiera guardada")

export const useClosePeriod = () =>
  useFinanceMutation(closePeriodAction, (period) => `Periodo ${formatPeriod(period.periodo)} cerrado`)

export const useReopenPeriod = () =>
  useFinanceMutation(reopenPeriodAction, (period) => `Periodo ${formatPeriod(period.periodo)} reabierto`)

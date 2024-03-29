const taxBillSelectors = {
  collector: "ddCollector",
  baseAVTax: "tbBaseAVTax",
  proration: "tbTaxProrate",
  exemption: "tbTaxExemption",
  dateReceived: "dpLiabilityReceivedDate_dateInput",
  avTax: "tbActualAVTax",
  navTax: "tbNAVTax",
  totalAmountLiability: "tbTotalTaxLiability",
  discount: "tbTaxCredits",
  penalty: "tbTaxDebits",
  finalTotalLiability: "tbTotalTaxLiability2",
  dataSourceAssessment: "ddDataSourceAssessment",
  dataSourceLiability: "ddDataSourceTaxLiability",
  dataSourceLiabilityParcelQuest:
    "#ddDataSourceTaxLiability > option:nth-child(12)",
  dataSourceLiabilityLegalDocument:
    "#ddDataSourceTaxLiability > option:nth-child(1)",
  milRate: "tbMillRate",
  exemptionPercentage: "tbTaxExemptionPercentage",
  btnSaveAssessment: "btnSaveAssessment",
  previousLiability: "btnPreviousLiability",
  nextLiability: "btnNextLiability",
  addNewTaxLiability: "btnAddNewLiability",
  recalculateLiability: "btnRecalculateLiability",
  saveLiability: "btnSaveLiability",
  cancelLiability: "btnCancelLiability",
  deleteLiability: "btnDeleteLiability",
  generatePayments: "btnGeneratePayments",
  addNewTaxPayment: "btnAddNewPayment",
  saveAll: "btnSaveALLPayment",

  finalPayment1: "tbBasePaymentAmount1",
  basePayment1: "tbBaseAmountTransmittal1",
  dueByPayment1: "dpBasePaymentDueByDate1_dateInput",
  savePayment1: "btnSavePayment1",
  cancelPayment1: "btnCancelPayment1",
  deletePayment1: "btnDeletePayment1",

  finalPayment2: "tbBasePaymentAmount2",
  basePayment2: "tbBaseAmountTransmittal2",
  dueByPayment2: "dpBasePaymentDueByDate2_dateInput",
  savePayment2: "btnSavePayment2",
  cancelPayment2: "btnCancelPayment2",
  deletePayment2: "btnDeletePayment2",

  finalPayment3: "tbBasePaymentAmount3",
  basePayment3: "tbBaseAmountTransmittal3",
  dueByPayment3: "dpBasePaymentDueByDate3_dateInput",
  savePayment3: "btnSavePayment3",
  cancelPayment3: "btnCancelPayment3",
  deletePayment3: "btnDeletePayment3",

  finalPayment4: "tbBasePaymentAmount4",
  basePayment4: "tbBaseAmountTransmittal4",
  dueByPayment4: "dpBasePaymentDueByDate4_dateInput",
  savePayment4: "btnSavePayment4",
  cancelPayment4: "btnCancelPayment4",
  deletePayment4: "btnDeletePayment4",
};

module.exports = taxBillSelectors;

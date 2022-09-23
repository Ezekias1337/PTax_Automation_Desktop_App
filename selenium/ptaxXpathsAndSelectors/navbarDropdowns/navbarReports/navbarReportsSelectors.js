const navbarReportsSelectors = {
  tab: "/html/body/form/div[4]/div/ul/li[7]/a/span",
  ptaxReportGenerator: {
    tab: "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[9]/a/span",
    ptaxReportGenerator: "",
    reportGeneratorLocationPaymentsByParcel: "",
  },
  ptrInternalUserReports: {
    tab: "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[10]/a/span",
    appealApplicationTracking:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[10]/div/ul/li[9]/a/span",
    appealCalendar:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[10]/div/ul/li[10]/a/span",
    assessmentChangeLessThan2Percent:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[10]/div/ul/li[11]/a/span",
    attachmentAForEl:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[10]/div/ul/li[12]/a/span",
    budgetModule:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[10]/div/ul/li[13]/a/span",
    directTaxReport:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[10]/div/ul/li[14]/a/span",
    documentTrackerReport:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[10]/div/ul/li[15]/a/span",
    exemptionsReport:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[10]/div/ul/li[16]/a/span",
    generalAppealAndPaymentDeadlinesReport:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[10]/div/ul/li[17]/a/span",
    hearingCalendar:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[10]/div/ul/li[18]/a/span",
    managerListAndEmailNotifications:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[10]/div/ul/li[19]/a/span",
    newLocationsReport:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[10]/div/ul/li[20]/a/span",
    personalPropertyParcels:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[10]/div/ul/li[21]/a/span",
    refundsReport: {
      tab: "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[10]/div/ul/li[22]/a/span",
      expectedRefunds:
        "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[10]/div/ul/li[22]/div/ul/li[9]/a/span",
      refundsIssued:
        "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[10]/div/ul/li[22]/div/ul/li[10]/a/span",
    },
    taxSavingsReport:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[10]/div/ul/li[23]/a/span",
    texasLitigationTaxSavingsReport:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[10]/div/ul/li[24]/a/span",
    transmittalEmailAlertSetupReport:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[10]/div/ul/li[25]/a/span",
    valueReductions:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[10]/div/ul/li[26]/a/span",
    brookfieldPaymentStatus:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[10]/div/ul/li[27]/a/span",
  },
  auditReports: {
    tab: "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/a/span",
    appeals: {
      tab: "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[9]/a/span",
      deadlineDifference:
        "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[9]/div/ul/li[9]/a/span",
      undecidedAppeals:
        "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[9]/div/ul/li[10]/a/span",
    },
    assessorDifferences: {
      tab: "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[10]/a/span",
      assessorVsCollector:
        "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[10]/div/ul/li[9]/a/span",
      locationVsParcel:
        "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[10]/div/ul/li[10]/a/span",
      parcelVsAssessment:
        "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[10]/div/ul/li[11]/a/span",
    },
    assessorInformation:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[11]/a/span",
    collectorsWithoutPaymentSetup:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[12]/a/span",
    locationLevelDataAudit:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[13]/a/span",
    missingData: {
      tab: "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[14]/a/span",
      assessments:
        "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[14]/div/ul/li[9]/a/span",
      asmtsWithAppealDeadlinesIn30Days:
        "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[14]/div/ul/li[10]/a/span",
      liabilities:
        "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[14]/div/ul/li[11]/a/span",
      payments:
        "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[14]/div/ul/li[12]/a/span",
      prop13Values:
        "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[14]/div/ul/li[13]/a/span",
      refunds:
        "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[14]/div/ul/li[14]/a/span",
      expectedSupplementalBillsAlert:
        "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[14]/div/ul/li[15]/a/span",
    },
    mveEqualsSumParts:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[15]/a/span",
    mveEqualsAVCA:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[16]/a/span",
    parcelNameAudit:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[17]/a/span",
    parcels2YearsData:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[18]/a/span",
    pTaxSolutionVerificationOfSetUpReport:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[19]/a/span",
    scannedDocEmailVerification:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[20]/a/span",
    taxLiabilityEqualsSumParts:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[21]/a/span",
    usersWithMultiCompanyAccessReport:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[22]/a/span",
    prop13ValuesVsMVE:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[23]/a/span",
    userEmailAlertsReport:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[24]/a/span",
    parcelCollectorConfiguration:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[11]/div/ul/li[25]/a/span",
  },
  ptaxSolutionReports: {
    tab: "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[12]/a/span",
    annualCalendarYearTaxReportForCompany:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[12]/div/ul/li[9]/a/span",
    appealApprovalReport:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[12]/div/ul/li[10]/a/span",
    appealStatusReport:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[12]/div/ul/li[11]/a/span",
    approximateLocationAppealDeadlines:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[12]/div/ul/li[12]/a/span",
    approximateParcelAppealDeadlines:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[12]/div/ul/li[13]/a/span",
    AssessmentsAndPaymentDueMonths:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[12]/div/ul/li[14]/a/span",
    billPaymentApprovalReport:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[12]/div/ul/li[15]/a/span",
    controlSheet:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[12]/div/ul/li[16]/a/span",
    expectedLiabilities:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[12]/div/ul/li[17]/a/span",
    expectedLiabilitiesWithForecast:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[12]/div/ul/li[18]/a/span",
    paymentAndAppealApproverReport:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[12]/div/ul/li[19]/a/span",
    taxPaymentConfirmation:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[12]/div/ul/li[20]/a/span",
    unPivotedTaxData:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[12]/div/ul/li[21]/a/span",
    personalPropertyReturnDeadlines:
      "/html/body/form/div[4]/div/ul/li[7]/div/ul/li[12]/div/ul/li[22]/a/span",
  },
};

module.exports = navbarReportsSelectors;

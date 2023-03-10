const assessmentNotices = require("../automations/assessment-notices/assessmentNotices");
const checkWebsiteURLs = require("../automations/check-urls/checkWebsiteURLs");
const paymentConfirmations = require("../automations/payment-confirmations/paymentConfirmations");
const propertyPointOfContact = require("../automations/property-point-of-contact/propertyPointOfContact");
const taxBills = require("../automations/tax-bills/taxBills");
const addNewParcels = require("../automations/add-new-parcels/addNewParcels");
const updateParcelNames = require("../automations/update-parcel-names/updateParcelNames");
const importPropertyValues = require("../automations/import-property-values/importPropertyValues");

/* 
  I wanted to place this in a shared folder at the root directory,
  but because of the way react compiles files, you cant import files
  from outside the src directory.
  
  
  Because of this, the listOfAutomations.js file exists in two 
  locations:
  
    1.) src/constants/listOfAutomations.js
    2.) selenium/automations/listOfAutomations/listOfAutomations.js

  The only differences between the two is that:
  
    a.) The version living in the
        selenium folder includes functions in the object representing different
        automations
    b.) The version in the src folder is exported as an array.
*/

const listOfAutomations = {
  assessmentNotices: {
    key: 1,
    name: "Assessment Notices",
    locations: [
      {
        key: 1,
        state: "Nevada",
        subLocations: [
          { key: 1, name: "Clark County", function: assessmentNotices },
        ],
      },
      {
        key: 2,
        state: "New York",
        subLocations: [
          {
            key: 1,
            name: "New York County",
            function: assessmentNotices,
            availableOperations: [
              "Data Entry",
              "Download Document",
              "Data Entry, Download Document, & Upload Document",
            ],
          },
        ],
      },
      {
        key: 3,
        state: "California",
        subLocations: [
          {
            key: 1,
            name: "Kern",
            function: assessmentNotices,
            availableOperations: [
              "Data Entry",
              "Download Document",
              "Data Entry, Download Document, & Upload Document",
            ],
          },
          {
            key: 2,
            name: "Los Angeles",
            function: assessmentNotices,
            availableOperations: [
              "Data Entry",
              "Download Document",
              "Data Entry, Download Document, & Upload Document",
            ],
          },
          {
            key: 3,
            name: "Riverside",
            function: assessmentNotices,
            availableOperations: [
              "Data Entry",
              "Download Document",
              "Data Entry, Download Document, & Upload Document",
            ],
          },
          {
            key: 4,
            name: "San Bernardino",
            function: assessmentNotices,
            availableOperations: [
              "Data Entry",
              "Download Document",
              "Data Entry, Download Document, & Upload Document",
            ],
          },
          {
            key: 5,
            name: "San Diego",
            function: assessmentNotices,
            availableOperations: ["Download Document"],
          },
        ],
      },
    ],
    operations: [
      { key: 1, name: "Data Entry" },
      { key: 2, name: "Download Files" },
      { key: 3, name: "Data Entry And Download Files" },
    ],
  },
  paymentConfirmations: {
    key: 2,
    name: "Payment Confirmations",
    locations: [
      {
        key: 1,
        state: "California",
        subLocations: [
          { key: 1, name: "Los Angeles", function: paymentConfirmations },
          { key: 2, name: "Orange County", function: paymentConfirmations },
          { key: 3, name: "Riverside County", function: paymentConfirmations },
          { key: 4, name: "San Bernardino", function: paymentConfirmations },
          { key: 5, name: "San Diego", function: paymentConfirmations },
          { key: 4, name: "Ventura County", function: paymentConfirmations },
        ],
      },
      {
        key: 2,
        state: "Pennsylvania",
        subLocations: [
          { key: 1, name: "Multnomah County", function: paymentConfirmations },
        ],
      },
    ],
  },
  propertyPointOfContact: {
    key: 3,
    name: "Property Point of Contact",
    WIP: true,
  },
  taxBills: {
    key: 4,
    name: "Property Tax Bills",
    locations: [
      {
        key: 1,
        state: "California",
        subLocations: [
          {
            key: 1,
            name: "Los Angeles",
            function: taxBills,
            availableOperations: [
              "Data Entry",
              "Download Document",
              "Data Entry, Download Document, & Upload Document",
            ],
          },
        ],
      },
      {
        key: 2,
        state: "New York",
        subLocations: [
          {
            key: 1,
            name: "New York City",
            function: taxBills,
            availableOperations: [
              "Data Entry",
              "Download Document",
              "Data Entry, Download Document, & Upload Document",
            ],
          },
        ],
      },
      {
        key: 3,
        state: "Illinois",
        subLocations: [
          {
            key: 1,
            name: "Cook County",
            function: taxBills,
            availableOperations: [
              "Data Entry",
              "Download Document",
              "Data Entry, Download Document, & Upload Document",
            ],
          },
        ],
      },
    ],
    operations: [
      { key: 1, name: "Data Entry" },
      { key: 2, name: "Download Files" },
      { key: 3, name: "Data Entry And Download Files" },
    ],
  },
  addNewParcels: {
    key: 5,
    name: "Add New Parcels",
    function: addNewParcels,
  },
  updateParcelNames: {
    key: 6,
    name: "Update Parcel Names",
    function: updateParcelNames,
  },
  checkWebsiteURLs: {
    key: 7,
    name: "Check all the links for Assessors/Collectors",
    function: checkWebsiteURLs,
  },
  importPropertyValues: {
    key: 8,
    name: "Import Property Values",
    function: importPropertyValues,
  },
};

module.exports = listOfAutomations;

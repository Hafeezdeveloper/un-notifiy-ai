import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


const initialState = {
    discussions: 0,
    participant: 0,
    provider: 0,
    pendingJobs: 0,
    activeJobs: 0,
    cancelledJobs: 0,  
    completedJobs: 0,  
    pendingDisputes: 0,
    pendingReports: 0,
    ongoingDisputes: 0,
    resolvedDisputes: 0,
    unviewedReviews: 0,
    unviewedRequests: 0,
    pendingProperty: 0,
    approvedProperty: 0,
    declinedProperty: 0,
    occupiedProperty: 0,
    selfManaged: 0,
    planManaged: 0,
    agencyManaged: 0,
    independentSupportWorker: 0,
    alliedHealthProfessional: 0,
    planManager: 0,
    supportCoordinator: 0,
    company: 0,
    participant_accepted: 0,
    company_accepted: 0,
    independentSupportWorker_accepted: 0,
    alliedHealthProfessional_accepted: 0,
    planManager_accepted: 0,
    supportCoordinator_accepted: 0,
    planManager_pending: 0,
    supportCoordinator_pending: 0,
    alliedHealthProfessional_pending: 0,
    independentSupportWorker_pending: 0,
    company_pending: 0,
    participant_pending: 0,
    connection_pending: 0,
    approved_jobs: 0,
    shortlist_applicant: 0,
    quotation_sent: 0,
    declined_jobs: 0,
    all_jobs: 0,
    provider_onboard_job: 0,
    participant_onboard_job: 0,
    sc_coordination_hub: 0,
    sc_applicants: 0,
    sc_quotation: 0,
    sc_jobs: 0,
    pm_coordination_hub:0,
    pm_jobs:0,
    participant_shifts:0,
    provider_shifts:0,
    participant_sc_shifts:0,
    carer_shifts:0,
    participant_timesheets:0,
    provider_timesheet:0,
    carer_timesheet:0,
    participant_invoice:0,
    sc_participant_invoice:0,
    pm_participant_invoice:0,
    provider_invoice:0,
    staff_payroll:0,
    provider_payroll:0,
    staff_payroll_paid:0,
    staff_payroll_pending:0,
    provider_payroll_pending:0,
    provider_payroll_paid:0,
    company_sc_jobs:0,
    participant_complete_job:0,
    provider_complete_job:0,
    company_sc_employee:0,
    participant_invoice_pending:0,
    provider_invoice_paid:0,
    property_declined:0,
    property_approved:0,
    company_switch_accepted:0,
    userRequestPending:0,
    approved_property:0,

    loading: false,
    error: null,
};

const countsSlice = createSlice({
    name: 'counts',
    initialState,
    reducers: {
        fetchCountsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchCountsSuccess: (state, action) => {
            if (Object.keys(action.payload).length === 1) {
                const key = Object.keys(action.payload)[0]; // Get the single key in the payload
                if (state[key] !== undefined) {
                    state[key] += action.payload[key]; // Increment the matching count
                }
            } else {

                state.loading = false;
                state.discussions = action.payload.discussions;
                state.participant = action.payload.participant;
                state.provider = action.payload.provider;
                state.pendingJobs = action.payload.pendingJobs;
                state.activeJobs = action.payload.activeJobs;
                state.cancelledJobs = action.payload.cancelledJobs;  // Added field
                state.completedJobs = action.payload.completedJobs;  // Added field
                state.pendingDisputes = action.payload.pendingDisputes;
                state.pendingReports = action.payload.pendingReports;
                state.ongoingDisputes = action.payload.ongoingDisputes;
                state.resolvedDisputes = action.payload.resolvedDisputes;
                state.unviewedReviews = action.payload.unviewedReviews;
                state.unviewedRequests = action.payload.unviewedRequests;
                state.pendingProperty = action.payload.pendingProperty;
                state.approvedProperty = action.payload.approvedProperty;
                state.declinedProperty = action.payload.declinedProperty;
                state.occupiedProperty = action.payload.occupiedProperty;
                state.company = action.payload.company;
                state.selfManaged = action.payload.selfManaged;
                state.planManaged = action.payload.planManaged;
                state.agencyManaged = action.payload.agencyManaged;
                state.independentSupportWorker = action.payload.independentSupportWorker;
                state.alliedHealthProfessional = action.payload.alliedHealthProfessional;
                state.planManager = action.payload.planManager;
                state.supportCoordinator = action.payload.supportCoordinator;
                state.participant_accepted = action.payload.participant_accepted;
                state.company_accepted = action.payload.company_accepted;
                state.independentSupportWorker_accepted = action.payload.independentSupportWorker_accepted;
                state.alliedHealthProfessional_accepted = action.payload.alliedHealthProfessional_accepted;
                state.planManager_accepted = action.payload.planManager_accepted;
                state.supportCoordinator_accepted = action.payload.supportCoordinator_accepted;
                state.planManager_pending = action.payload.planManager_pending;
                state.alliedHealthProfessional_pending = action.payload.alliedHealthProfessional_pending;
                state.independentSupportWorker_pending = action.payload.independentSupportWorker_pending;
                state.supportCoordinator_pending = action.payload.supportCoordinator_pending;
                state.company_pending = action.payload.company_pending;
                state.participant_pending = action.payload.participant_pending;
                state.connection_pending = action.payload.connection_pending;
                state.approved_jobs = action.payload.approved_jobs;
                state.all_jobs = action.payload.all_jobs;
                state.shortlist_applicant = action.payload.shortlist_applicant;
                state.quotation_sent = action.payload.quotation_sent;
                state.onboard_job = action.payload.onboard_job;
                state.declined_jobs = action.payload.declined_jobs;
                state.participant_onboard_job = action.payload.participant_onboard_job;
                state.provider_onboard_job = action.payload.provider_onboard_job;
                state.sc_coordination_hub = action.payload.sc_coordination_hub;
                state.sc_applicants = action.payload.sc_applicants;
                state.sc_quotation = action.payload.sc_quotation;
                state.sc_jobs = action.payload.sc_jobs;
                state.pm_coordination_hub = action.payload.pm_coordination_hub;
                state.pm_jobs = action.payload.pm_jobs;
                state.participant_shifts = action.payload.participant_shifts;
                state.provider_shifts = action.payload.provider_shifts;
                state.participant_sc_shifts = action.payload.participant_sc_shifts;
                state.carer_shifts = action.payload.carer_shifts;
                state.participant_timesheets = action.payload.participant_timesheets;
                state.provider_timesheet = action.payload.provider_timesheet;
                state.carer_timesheet = action.payload.carer_timesheet;
                state.participant_invoice = action.payload.participant_invoice;
                state.sc_participant_invoice = action.payload.sc_participant_invoice;
                state.pm_participant_invoice = action.payload.pm_participant_invoice;
                state.provider_invoice = action.payload.provider_invoice;
                state.staff_payroll = action.payload.staff_payroll;
                state.provider_payroll = action.payload.provider_payroll;
                state.staff_payroll_paid = action.payload.staff_payroll_paid;
                state.staff_payroll_pending = action.payload.staff_payroll_pending;
                state.provider_payroll_pending = action.payload.provider_payroll_pending;
                state.provider_payroll_paid = action.payload.provider_payroll_paid;
                state.company_sc_jobs = action.payload.company_sc_jobs;
                state.participant_complete_job = action.payload.participant_complete_job;
                state.provider_complete_job = action.payload.provider_complete_job;
                state.company_sc_employee = action.payload.company_sc_employee;
                state.participant_invoice_pending = action.payload.participant_invoice_pending;
                state.provider_invoice_paid = action.payload.provider_invoice_paid;
                state.property_approved = action.payload.property_approved;
                state.property_declined = action.payload.property_declined;
                state.company_switch_accepted = action.payload.company_switch_accepted;
                state.userRequestPending = action.payload.userRequestPending;
                state.approved_property = action.payload.approved_property;
            }
        },
        fetchCountsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        resetCount: (state, action) => {
            const key = action.payload; // Get the key from the action payload
            if (state[key] !== undefined) {
                state[key] = 0; // Reset the matching count to 0
            }
        }





    }
});

export const { fetchCountsStart, fetchCountsSuccess, fetchCountsFailure, resetCount } = countsSlice.actions;

export default countsSlice.reducer;

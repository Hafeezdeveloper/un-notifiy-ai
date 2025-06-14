import { createSlice } from '@reduxjs/toolkit';


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
    annoucenment:0,
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
        fetchCountsSuccess: (state: any, action: any) => {
            console.log("awdwad",action.payload )
            if (Object.keys(action.payload).length === 1) {
                const key = Object.keys(action.payload)[0]; // Get the single key in the payload
                if (state[key] !== undefined) {
                    state[key] += action.payload[key]; // Increment the matching count
                }
            } else {

                state.loading = false;
                state.annoucenment = action.payload.annoucenment;
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
           
            }
        },
        fetchCountsFailure: (state: any, action:any) => {
            state.loading = false;
            state.error = action.payload;
        },
        resetCount: (state :any, action: any) => {
            const key = action.payload; // Get the key from the action payload
            if (state[key] !== undefined) {
                state[key] = 0; // Reset the matching count to 0
            }
        }





    }
});

export const { fetchCountsStart, fetchCountsSuccess, fetchCountsFailure, resetCount } = countsSlice.actions;

export default countsSlice.reducer;

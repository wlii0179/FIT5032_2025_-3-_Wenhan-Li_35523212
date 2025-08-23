import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  // Health Info
  { path: '/health-info', name: 'HealthInfo', component: () => import('../views/HealthInfo.vue') },
  { path: '/health-info/common-diseases', name: 'CommonDiseases', component: () => import('../views/CommonDiseases.vue') },
  { path: '/health-info/diet-nutrition', name: 'DietNutrition', component: () => import('../views/DietNutrition.vue') },
  { path: '/health-info/exercise-rehab', name: 'ExerciseRehab', component: () => import('../views/ExerciseRehab.vue') },
  // Community Events
  { path: '/community-events', name: 'CommunityEvents', component: () => import('../views/CommunityEvents.vue') },
  { path: '/community-events/event-calendar', name: 'EventCalendar', component: () => import('../views/EventCalendar.vue') },
  { path: '/community-events/event-registration', name: 'EventRegistration', component: () => import('../views/EventRegistration.vue') },
  { path: '/community-events/event-gallery', name: 'EventGallery', component: () => import('../views/EventGallery.vue') },
  // Online Consultation
  { path: '/online-consultation', name: 'OnlineConsultation', component: () => import('../views/OnlineConsultation.vue') },
  { path: '/online-consultation/doctor-qa', name: 'DoctorQA', component: () => import('../views/DoctorQA.vue') },
  { path: '/online-consultation/volunteer-support', name: 'VolunteerSupport', component: () => import('../views/VolunteerSupport.vue') },
  // Health Records
  { path: '/health-record', name: 'HealthRecord', component: () => import('../views/HealthRecord.vue') },
  { path: '/data-visualization', name: 'DataVisualization', component: () => import('../views/DataVisualization.vue') },
  { path: '/data-export', name: 'DataExport', component: () => import('../views/DataExport.vue') },
  { path: '/offline', name: 'Offline', component: () => import('../views/Offline.vue') },
  // Medication Reminder
  { path: '/medication-reminder', name: 'MedicationReminder', component: () => import('../views/MedicationReminder.vue') },
  { path: '/medication-reminder/add-reminder', name: 'AddReminder', component: () => import('../views/AddReminder.vue') },
  { path: '/medication-reminder/reminder-history', name: 'ReminderHistory', component: () => import('../views/ReminderHistory.vue') },
  // Community Forum
  { path: '/community-forum', name: 'CommunityForum', component: () => import('../views/CommunityForum.vue') },
  { path: '/community-forum/experience-sharing', name: 'ExperienceSharing', component: () => import('../views/ExperienceSharing.vue') },
  { path: '/community-forum/emotional-support', name: 'EmotionalSupport', component: () => import('../views/EmotionalSupport.vue') },
  { path: '/community-forum/help-questions', name: 'HelpQuestions', component: () => import('../views/HelpQuestions.vue') },
  // Caregiver Info
  { path: '/caregiver-info', name: 'CaregiverInfo', component: () => import('../views/CaregiverInfo.vue') },
  { path: '/caregiver-info/care-skills', name: 'CareSkills', component: () => import('../views/CareSkills.vue') },
  { path: '/caregiver-info/family-forum', name: 'FamilyForum', component: () => import('../views/FamilyForum.vue') },
  // About Us
  { path: '/about-us', name: 'AboutUs', component: () => import('../views/AboutUs.vue') },
  { path: '/about-us/organization-intro', name: 'OrganizationIntro', component: () => import('../views/OrganizationIntro.vue') },
  { path: '/about-us/contact-us', name: 'ContactUs', component: () => import('../views/ContactUs.vue') },
  // Login/Register
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('../views/Register.vue') },
  { path: '/profile', name: 'Profile', component: () => import('../views/Profile.vue') },
  { path: '/admin', name: 'AdminDashboard', component: () => import('../views/AdminDashboard.vue') },
  { path: '/map', name: 'MapView', component: () => import('../views/MapView.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局前置守卫：未登录用户只能访问Home、Login、Register
router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/login', '/register'];
  const isPublic = publicPages.includes(to.path);
  const currentUser = localStorage.getItem('currentUser');
  if (!isPublic && !currentUser) {
    alert('Please login to access this page.');
    next('/login');
  } else {
    next();
  }
});

export default router;

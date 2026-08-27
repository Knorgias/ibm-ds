import './style.css';

import '@carbon/web-components/es/components/link/index.js';
import '@carbon/web-components/es/components/button/index.js';
import '@carbon/web-components/es/components/radio-button/index.js';
import '@carbon/web-components/es/components/accordion/index.js';
import '@carbon/web-components/es/components/date-picker/index.js';
import '@carbon/web-components/es/components/text-input/index.js';

import { toString } from '@carbon/icon-helpers';
import ChevronLeft16 from '@carbon/icons/es/chevron--left/16.js';
import Close16 from '@carbon/icons/es/close/16.js';
import ArrowRight16 from '@carbon/icons/es/arrow--right/16.js';
import Checkmark16 from '@carbon/icons/es/checkmark/16.js';

const slotIcon = (descriptor) =>
  toString(descriptor).replace('<svg', '<svg slot="icon"');

const stepperIcon = (descriptor) => toString(descriptor);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[\d\s().-]{7,}$/;

const STEP3_FIELD_VALIDATORS = [
  ['cds-text-input[name="first-name"]', (value) => value.trim().length > 0],
  ['cds-text-input[name="last-name"]', (value) => value.trim().length > 0],
  ['cds-text-input[name="email"]', (value) => EMAIL_PATTERN.test(value.trim())],
  ['cds-text-input[name="phone"]', (value) => PHONE_PATTERN.test(value.trim())],
  ['cds-date-picker-input', (value) => value.trim().length > 0],
];

function validateField(field, test) {
  const isValid = test(field.value ?? '');
  field.invalid = !isValid;
  return isValid;
}

function validateStep3(app) {
  let firstInvalidField = null;
  let allValid = true;

  for (const [selector, test] of STEP3_FIELD_VALIDATORS) {
    const field = app.querySelector(selector);
    if (!validateField(field, test)) {
      allValid = false;
      firstInvalidField ??= field;
    }
  }

  firstInvalidField?.focus();
  return allValid;
}

const STEPS = [
  { label: '1. Select Insurance', subActive: null, subComplete: 'Completed' },
  { label: 'Customize coverage', subActive: 'Travel annual (Active)', subComplete: 'Completed' },
  { label: 'Personal details', subActive: 'Travel annual (Active)', subComplete: 'Completed' },
  { label: 'Review & pay', subActive: null, subComplete: 'Completed' },
];

function renderStepper(activeStep) {
  return STEPS.map((step, i) => {
    const stepNumber = i + 1;
    const isComplete = stepNumber < activeStep;
    const isActive = stepNumber === activeStep;
    const sub = isComplete ? step.subComplete : isActive ? step.subActive : null;
    const liClass = ['step', isComplete && 'step-complete', isActive && 'step-active']
      .filter(Boolean)
      .join(' ');
    const iconClass = ['step-icon', isComplete && 'step-icon-complete', isActive && 'step-icon-active']
      .filter(Boolean)
      .join(' ');
    const iconContent = isComplete ? stepperIcon(Checkmark16) : String(stepNumber);

    return `
      <li class="${liClass}">
        <span class="${iconClass}">${iconContent}</span>
        <div class="step-text">
          <p class="step-label">${step.label}</p>
          ${sub ? `<p class="step-sub">${sub}</p>` : ''}
        </div>
      </li>
    `;
  }).join('');
}

function renderTopNav() {
  return `
    <div class="top-nav">
      <cds-link href="#" size="md">
        Back
        ${slotIcon(ChevronLeft16)}
      </cds-link>
      <div class="close-action">
        <span class="close-label">Close</span>
        <cds-button kind="ghost" size="sm" class="icon-only-button">
          ${slotIcon(Close16)}
        </cds-button>
      </div>
    </div>
  `;
}

function renderFooter(stepNumber) {
  return `
    <div class="footer-actions">
      <p class="step-counter">Step ${stepNumber} of 4</p>
      <cds-button kind="primary">
        Continue
        ${slotIcon(ArrowRight16)}
      </cds-button>
    </div>
  `;
}

function renderCustomizeCoverage() {
  return `
    <div class="form-container">
      <div class="header-block">
        <p class="eyebrow">Travel annual</p>
        <h2 class="headline">Customize your coverage</h2>
        <p class="subtext">The prices below are per month and include insurance tax.</p>
      </div>

      <section class="form-section">
        <cds-radio-button-group
          name="destination"
          value="europe"
          orientation="horizontal"
          legend-text="Where will you travel?"
        >
          <cds-radio-button label-text="Europe" value="europe"></cds-radio-button>
          <cds-radio-button label-text="World" value="world"></cds-radio-button>
        </cds-radio-button-group>
      </section>

      <cds-accordion alignment="start">
        <cds-accordion-item alignment="start" title="More information about travel destination"></cds-accordion-item>
      </cds-accordion>

      <section class="form-section">
        <cds-radio-button-group
          name="duration"
          value="90"
          orientation="horizontal"
          legend-text="How many maximum consecutive days are you going to travel?"
        >
          <cds-radio-button label-text="90 days" value="90"></cds-radio-button>
          <cds-radio-button label-text="180 days" value="180"></cds-radio-button>
        </cds-radio-button-group>
      </section>

      <cds-accordion alignment="start">
        <cds-accordion-item alignment="start" title="More information about travel duration"></cds-accordion-item>
      </cds-accordion>

      <section class="form-section form-section-date">
        <cds-date-picker date-format="d-m-Y">
          <cds-date-picker-input
            kind="single"
            label-text="Effective date"
            placeholder="DD-MM-YYYY"
          ></cds-date-picker-input>
        </cds-date-picker>
      </section>
    </div>
  `;
}

function renderPersonalDetails() {
  return `
    <div class="form-container">
      <div class="header-block">
        <p class="eyebrow">Travel annual</p>
        <h2 class="headline">Your personal details</h2>
        <p class="subtext">These details are used to verify your identity and issue your policy documents.</p>
      </div>

      <section class="form-section">
        <cds-text-input label="First name" placeholder="e.g. Jordan" name="first-name" size="lg" required invalid-text="First name is required"></cds-text-input>
      </section>

      <section class="form-section">
        <cds-text-input label="Last name" placeholder="e.g. Alexis" name="last-name" size="lg" required invalid-text="Last name is required"></cds-text-input>
      </section>

      <section class="form-section">
        <cds-text-input label="Email address" placeholder="you@example.com" name="email" type="email" size="lg" required invalid-text="Enter a valid email address"></cds-text-input>
      </section>

      <section class="form-section">
        <cds-text-input label="Phone number" placeholder="+1 555 123 4567" name="phone" type="tel" size="lg" required invalid-text="Enter a valid phone number"></cds-text-input>
      </section>

      <section class="form-section form-section-date">
        <cds-date-picker date-format="d-m-Y">
          <cds-date-picker-input
            kind="single"
            label-text="Date of birth"
            placeholder="DD-MM-YYYY"
            required
            invalid-text="Date of birth is required"
          ></cds-date-picker-input>
        </cds-date-picker>
      </section>
    </div>
  `;
}

const STEP_CONTENT = {
  2: renderCustomizeCoverage,
  3: renderPersonalDetails,
};

function render(stepNumber) {
  document.querySelector('#app').innerHTML = `
    <div class="wizard">
      <aside class="wizard-sidebar">
        <div class="sidebar-header">
          <p class="overline">Insurance Wizard</p>
          <h1 class="sidebar-title">Insurance Cover</h1>
        </div>
        <ol class="stepper">
          ${renderStepper(stepNumber)}
        </ol>
      </aside>

      <main class="wizard-workspace">
        ${renderTopNav()}
        ${STEP_CONTENT[stepNumber]()}
        ${renderFooter(stepNumber)}
      </main>
    </div>
  `;

  const app = document.querySelector('#app');

  if (stepNumber === 2) {
    app.querySelector('.footer-actions cds-button')?.addEventListener('click', () => render(3));
  }

  if (stepNumber === 3) {
    app.querySelector('.top-nav cds-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      render(2);
    });

    for (const [selector, test] of STEP3_FIELD_VALIDATORS) {
      const field = app.querySelector(selector);
      field?.addEventListener('blur', () => validateField(field, test));
    }

    app.querySelector('.footer-actions cds-button')?.addEventListener('click', () => {
      validateStep3(app);
    });
  }
}

render(2);

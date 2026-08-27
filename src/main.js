import './style.css';

import '@carbon/web-components/es/components/link/index.js';
import '@carbon/web-components/es/components/button/index.js';
import '@carbon/web-components/es/components/radio-button/index.js';
import '@carbon/web-components/es/components/accordion/index.js';
import '@carbon/web-components/es/components/date-picker/index.js';

import { toString } from '@carbon/icon-helpers';
import ChevronLeft16 from '@carbon/icons/es/chevron--left/16.js';
import Close16 from '@carbon/icons/es/close/16.js';
import ArrowRight16 from '@carbon/icons/es/arrow--right/16.js';
import Checkmark16 from '@carbon/icons/es/checkmark/16.js';

const slotIcon = (descriptor) =>
  toString(descriptor).replace('<svg', '<svg slot="icon"');

const stepperIcon = (descriptor) => toString(descriptor);

document.querySelector('#app').innerHTML = `
  <div class="wizard">
    <aside class="wizard-sidebar">
      <div class="sidebar-header">
        <p class="overline">Insurance Wizard</p>
        <h1 class="sidebar-title">Insurance Cover</h1>
      </div>
      <ol class="stepper">
        <li class="step step-complete">
          <span class="step-icon step-icon-complete">${stepperIcon(Checkmark16)}</span>
          <div class="step-text">
            <p class="step-label">1. Select Insurance</p>
            <p class="step-sub">Completed</p>
          </div>
        </li>
        <li class="step step-active">
          <span class="step-icon step-icon-active">2</span>
          <div class="step-text">
            <p class="step-label">Customize coverage</p>
            <p class="step-sub">Travel annual (Active)</p>
          </div>
        </li>
        <li class="step">
          <span class="step-icon">3</span>
          <div class="step-text">
            <p class="step-label">Personal details</p>
          </div>
        </li>
        <li class="step">
          <span class="step-icon">4</span>
          <div class="step-text">
            <p class="step-label">Review &amp; pay</p>
          </div>
        </li>
      </ol>
    </aside>

    <main class="wizard-workspace">
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

      <div class="footer-actions">
        <p class="step-counter">Step 2 of 4</p>
        <cds-button kind="primary">
          Continue
          ${slotIcon(ArrowRight16)}
        </cds-button>
      </div>
    </main>
  </div>
`;

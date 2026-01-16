<script setup lang="ts">
import { ref, computed } from 'vue';

const form = ref({
  name: '',
  email: '',
  message: ''
});

const errors = ref({
  name: '',
  email: '',
  message: ''
});

const isSubmitting = ref(false);
const isSubmitted = ref(false);

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateForm = () => {
  let isValid = true;
  errors.value = { name: '', email: '', message: '' };

  if (!form.value.name.trim()) {
    errors.value.name = 'Name is required';
    isValid = false;
  } else if (form.value.name.length < 2) {
    errors.value.name = 'Name must be at least 2 characters';
    isValid = false;
  }

  if (!form.value.email.trim()) {
    errors.value.email = 'Email is required';
    isValid = false;
  } else if (!isValidEmail(form.value.email)) {
    errors.value.email = 'Please enter a valid email';
    isValid = false;
  }

  if (!form.value.message.trim()) {
    errors.value.message = 'Message is required';
    isValid = false;
  } else if (form.value.message.length < 10) {
    errors.value.message = 'Message must be at least 10 characters';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));

  isSubmitting.value = false;
  isSubmitted.value = true;
  form.value = { name: '', email: '', message: '' };
};

const isFormValid = computed(() => {
  return form.value.name && form.value.email && form.value.message;
});
</script>

<template>
  <section id="contact" class="contact-section">
    <h2>Get in Touch</h2>
    <div class="form-container">
      <form v-if="!isSubmitted" @submit.prevent="handleSubmit" novalidate>
        <div class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="Your name"
            :class="{ error: errors.name }"
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="your@email.com"
            :class="{ error: errors.email }"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="message">Message</label>
          <textarea
            id="message"
            v-model="form.message"
            placeholder="How can we help?"
            rows="4"
            :class="{ error: errors.message }"
          ></textarea>
          <span v-if="errors.message" class="error-message">{{ errors.message }}</span>
        </div>

        <button type="submit" :disabled="isSubmitting || !isFormValid" class="submit-btn">
          <span v-if="isSubmitting">Sending...</span>
          <span v-else>Send Message</span>
        </button>
      </form>

      <div v-else class="success-message">
        <div class="success-icon">✓</div>
        <h3>Thank you!</h3>
        <p>Your message has been sent successfully. We'll get back to you soon.</p>
        <button @click="isSubmitted = false" class="reset-btn">Send Another Message</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-section {
  padding: 4rem 2rem;
  background: #f5f5f5;
}

.contact-section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #1a1a2e;
}

.form-container {
  max-width: 500px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #1a1a2e;
}

input, textarea {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  font-family: inherit;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #667eea;
}

input.error, textarea.error {
  border-color: #e74c3c;
}

.error-message {
  display: block;
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-message {
  text-align: center;
  padding: 2rem;
}

.success-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1rem;
}

.success-message h3 {
  font-size: 1.5rem;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
}

.success-message p {
  color: #666;
  margin-bottom: 1.5rem;
}

.reset-btn {
  background: none;
  border: 2px solid #667eea;
  color: #667eea;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.reset-btn:hover {
  background: #667eea;
  color: white;
}
</style>

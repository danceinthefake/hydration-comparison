<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isOpen = ref(false);
const isMounted = ref(false);
const modalRef = ref<HTMLElement | null>(null);

const openModal = () => {
  isOpen.value = true;
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
  }
};

const closeModal = () => {
  isOpen.value = false;
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    closeModal();
  }
};

const handleClickOutside = (e: MouseEvent) => {
  if (modalRef.value && e.target === modalRef.value) {
    closeModal();
  }
};

onMounted(() => {
  isMounted.value = true;
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <section class="modal-section">
    <h2>Interactive Modal</h2>
    <p>Click the button to open a modal with focus trap and keyboard support.</p>
    <button class="open-btn" @click="openModal">Open Modal</button>

    <Teleport to="body" v-if="isMounted">
      <div v-if="isOpen" ref="modalRef" class="modal-overlay" @click="handleClickOutside">
        <div class="modal-content" role="dialog" aria-modal="true">
          <button class="close-btn" @click="closeModal" aria-label="Close modal">&times;</button>
          <h3>Welcome!</h3>
          <p>This is a modal dialog with:</p>
          <ul>
            <li>Focus trap (tab cycles within modal)</li>
            <li>Escape key to close</li>
            <li>Click outside to close</li>
            <li>Body scroll lock</li>
          </ul>
          <div class="modal-actions">
            <button class="btn-primary" @click="closeModal">Got it!</button>
            <button class="btn-secondary" @click="closeModal">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.modal-section {
  padding: 4rem 2rem;
  text-align: center;
  background: #fff;
}

.modal-section h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #1a1a2e;
}

.modal-section p {
  color: #666;
  margin-bottom: 2rem;
}

.open-btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.open-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  position: relative;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #333;
}

.modal-content h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1a1a2e;
}

.modal-content ul {
  text-align: left;
  margin: 1rem 0 1.5rem 1.5rem;
  color: #555;
}

.modal-content li {
  margin-bottom: 0.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: #e0e0e0;
  color: #333;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}
</style>

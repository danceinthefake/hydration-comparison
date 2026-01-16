<script setup lang="ts">
import { ref } from 'vue';

const tabs = [
  {
    id: 'features',
    label: 'Features',
    content: {
      title: 'Powerful Features',
      description: 'Our platform offers cutting-edge features designed to boost your productivity and streamline your workflow.',
      items: ['Real-time collaboration', 'Advanced analytics', 'Custom integrations', 'API access']
    }
  },
  {
    id: 'security',
    label: 'Security',
    content: {
      title: 'Enterprise Security',
      description: 'Your data is protected with industry-leading security measures and compliance certifications.',
      items: ['End-to-end encryption', 'SOC 2 compliance', 'GDPR ready', 'Two-factor auth']
    }
  },
  {
    id: 'support',
    label: 'Support',
    content: {
      title: '24/7 Support',
      description: 'Our dedicated support team is always ready to help you succeed.',
      items: ['Live chat support', 'Phone support', 'Knowledge base', 'Video tutorials']
    }
  }
];

const activeTab = ref('features');

const setActiveTab = (tabId: string) => {
  activeTab.value = tabId;
};
</script>

<template>
  <section class="tabs-section">
    <h2>Explore Our Platform</h2>
    <div class="tabs-container">
      <div class="tabs-header" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
          @click="setActiveTab(tab.id)"
          role="tab"
          :aria-selected="activeTab === tab.id"
          :aria-controls="`panel-${tab.id}`"
        >
          {{ tab.label }}
        </button>
      </div>
      <div class="tabs-content">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          :id="`panel-${tab.id}`"
          :class="['tab-panel', { active: activeTab === tab.id }]"
          role="tabpanel"
        >
          <h3>{{ tab.content.title }}</h3>
          <p>{{ tab.content.description }}</p>
          <ul>
            <li v-for="item in tab.content.items" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tabs-section {
  padding: 4rem 2rem;
  background: #f8f9fa;
}

.tabs-section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #1a1a2e;
}

.tabs-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tabs-header {
  display: flex;
  background: #f0f0f0;
}

.tab-btn {
  flex: 1;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  background: #e8e8e8;
}

.tab-btn.active {
  background: white;
  color: #667eea;
  border-bottom-color: #667eea;
}

.tabs-content {
  padding: 2rem;
}

.tab-panel {
  display: none;
  animation: fadeIn 0.3s ease;
}

.tab-panel.active {
  display: block;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.tab-panel h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1a1a2e;
}

.tab-panel p {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.7;
}

.tab-panel ul {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.tab-panel li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  color: #555;
}

.tab-panel li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

@media (max-width: 600px) {
  .tabs-header {
    flex-direction: column;
  }

  .tab-panel ul {
    grid-template-columns: 1fr;
  }
}
</style>

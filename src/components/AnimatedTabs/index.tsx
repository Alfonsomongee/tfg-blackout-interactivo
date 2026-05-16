import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export const AnimatedTabs: React.FC<AnimatedTabsProps> = ({
  tabs,
  defaultTab = tabs[0]?.id,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const activeTabData = tabs.find(t => t.id === activeTab);

  return (
    <div className={className}>
      <div className="flex gap-2 border-b border-border mb-4" role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`px-4 py-2 font-mono text-sm transition-colors duration-200 relative ${
              activeTab === tab.id
                ? 'text-text-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                transition={{ duration: 0.3 }}
              />
            )}
          </button>
        ))}
      </div>

      {activeTabData && (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTabData.content}
        </motion.div>
      )}
    </div>
  );
};

export default AnimatedTabs;

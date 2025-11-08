
import React from 'react';
import type { CustomizationOptions, CaseChangeOption } from '../types';

interface SidebarProps {
  options: CustomizationOptions;
  setOptions: React.Dispatch<React.SetStateAction<CustomizationOptions>>;
  onClear: () => void;
  fileCount: number;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <h3 className="text-sm font-semibold text-slate-600 mb-3">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const Checkbox: React.FC<{ label: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, checked, onChange }) => (
  <label className="flex items-center text-sm text-slate-700 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
    />
    <span className="ml-2">{label}</span>
  </label>
);

const TextInput: React.FC<{ label: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, placeholder, value, onChange }) => (
  <div>
    <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({ options, setOptions, onClear, fileCount }) => {

  const handleOptionChange = <K extends keyof CustomizationOptions,>(key: K, value: CustomizationOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleCaseChange = (option: CaseChangeOption) => {
    setOptions(prev => ({ ...prev, caseChange: prev.caseChange === option ? '' : option }));
  };

  return (
    <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 bg-slate-100 p-4 lg:p-6 lg:h-screen lg:overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-800">Customization</h2>
        {fileCount > 0 && (
            <button
            onClick={onClear}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
            Clear
            </button>
        )}
      </div>
      <div className="space-y-4">
        <Section title="Remove Characters">
          <Checkbox label="Numbers (0-9)" checked={options.removeNumbers} onChange={e => handleOptionChange('removeNumbers', e.target.checked)} />
          <Checkbox label="Parentheses ( )" checked={options.removeParentheses} onChange={e => handleOptionChange('removeParentheses', e.target.checked)} />
          <Checkbox label="Dashes (-)" checked={options.removeDashes} onChange={e => handleOptionChange('removeDashes', e.target.checked)} />
          <Checkbox label="Spaces" checked={options.removeSpaces} onChange={e => handleOptionChange('removeSpaces', e.target.checked)} />
          <Checkbox label="Replace _ with spaces" checked={options.replaceUnderscoreWithSpace} onChange={e => handleOptionChange('replaceUnderscoreWithSpace', e.target.checked)} />
        </Section>
        
        <Section title="Case Changes">
          <Checkbox label="to lowercase" checked={options.caseChange === 'lowercase'} onChange={() => handleCaseChange('lowercase')} />
          <Checkbox label="TO UPPERCASE" checked={options.caseChange === 'uppercase'} onChange={() => handleCaseChange('uppercase')} />
          <Checkbox label="To Sentence case" checked={options.caseChange === 'sentence'} onChange={() => handleCaseChange('sentence')} />
          <Checkbox label="To Title Case" checked={options.caseChange === 'title'} onChange={() => handleCaseChange('title')} />
        </Section>

        <Section title="Text Modifications">
          <TextInput label="Add Prefix" placeholder="e.g., New_" value={options.addPrefix} onChange={e => handleOptionChange('addPrefix', e.target.value)} />
          <TextInput label="Add Suffix" placeholder="e.g., _edited" value={options.addSuffix} onChange={e => handleOptionChange('addSuffix', e.target.value)} />
          <TextInput label="Remove Specific Words" placeholder="word1,word2 (comma-separated)" value={options.removeWords} onChange={e => handleOptionChange('removeWords', e.target.value)} />
          <TextInput label="Change Extension" placeholder="e.g., jpg (leave empty to keep)" value={options.changeExtension} onChange={e => handleOptionChange('changeExtension', e.target.value)} />
        </Section>

        <Section title="Find & Replace">
            <TextInput label="Find Text" placeholder="Text to find" value={options.findText} onChange={e => handleOptionChange('findText', e.target.value)} />
            <TextInput label="Replace With" placeholder="Replacement text" value={options.replaceText} onChange={e => handleOptionChange('replaceText', e.target.value)} />
        </Section>

        <Section title="Length Limit">
            <label htmlFor="maxLength" className="block text-xs font-medium text-slate-500 mb-1">
                Max Filename Length: {options.maxLength > 0 ? options.maxLength : 'No Limit'}
            </label>
            <input
                id="maxLength"
                type="range"
                min="0"
                max="200"
                value={options.maxLength}
                onChange={e => handleOptionChange('maxLength', parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
        </Section>
      </div>
    </aside>
  );
};

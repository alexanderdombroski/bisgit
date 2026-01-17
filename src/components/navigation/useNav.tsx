import { useState, createContext, useContext, type PropsWithChildren } from 'react';

export const sections = {
  Status: 'Status',
  Log: 'Log',
  'Commit Details': 'Log',
  Branches: 'Branches',
  Worktrees: 'Branches',
  Remotes: 'Branches',
} as const;

const _sectionsNames = Object.keys(sections) as Section[];
export type SectionGroup = (typeof sections)[keyof typeof sections];
export type Section = keyof typeof sections;

type NavContextValue = {
  activeGroup: SectionGroup;
  setActiveGroup: (group: SectionGroup) => void;
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  prevSection: () => void;
  nextSection: () => void;
};

const NavContext = createContext<NavContextValue>({} as NavContextValue);

export function NavProvider({ children }: PropsWithChildren) {
  const [activeGroup, _setActiveGroup] = useState<SectionGroup>('Status');
  const [activeSection, _setActiveSection] = useState<Section>('Status');

  const setActiveSection = (section: Section) => {
    _setActiveSection(section);
    _setActiveGroup(sections[section]);
  };

  const setActiveGroup = (group: SectionGroup) => {
    _setActiveGroup(group);
    _setActiveSection(group);
  };

  const nextSection = () => {
    _setActiveSection((prev) => {
      const newSection = _sectionsNames.at(
        (_sectionsNames.indexOf(prev) + 1) % _sectionsNames.length
      ) as Section;
      _setActiveGroup(sections[newSection]);
      return newSection;
    });
  };

  const prevSection = () => {
    _setActiveSection((prev) => {
      const newSection = _sectionsNames.at(_sectionsNames.indexOf(prev) - 1) as Section;
      _setActiveGroup(sections[newSection]);
      return newSection;
    });
  };

  return (
    <NavContext.Provider
      value={{
        activeGroup,
        setActiveGroup,
        activeSection,
        setActiveSection,
        prevSection,
        nextSection,
      }}
    >
      {children}
    </NavContext.Provider>
  );
}

export function useNav(): NavContextValue {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error('useNavContext must be used within a NavProvider');
  }
  return context;
}

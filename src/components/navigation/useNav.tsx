import { useState, createContext, useContext, type PropsWithChildren } from 'react';

export const sections = {
  Files: 'Files',
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
  isLocked: Boolean;
  lock: () => void;
  unlock: () => void;
};

const NavContext = createContext<NavContextValue>({} as NavContextValue);

export function NavProvider({ children }: PropsWithChildren) {
  const [isLocked, setIsLocked] = useState(false);
  const lock = () => setIsLocked(true);
  const unlock = () => setIsLocked(false);

  const [activeGroup, _setActiveGroup] = useState<SectionGroup>('Status');
  const [activeSection, _setActiveSection] = useState<Section>('Status');

  const setActiveSection = (section: Section) => {
    if (isLocked) return;
    _setActiveSection(section);
    _setActiveGroup(sections[section]);
  };

  const setActiveGroup = (group: SectionGroup) => {
    if (isLocked) return;
    _setActiveGroup(group);
    _setActiveSection(group);
  };

  const nextSection = () => {
    if (isLocked) return;
    _setActiveSection((prev) => {
      const newSection = _sectionsNames.at(
        (_sectionsNames.indexOf(prev) + 1) % _sectionsNames.length
      ) as Section;
      _setActiveGroup(sections[newSection]);
      return newSection;
    });
  };

  const prevSection = () => {
    if (isLocked) return;
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
        isLocked,
        lock,
        unlock,
      }}
    >
      {children}
    </NavContext.Provider>
  );
}

export function useNav(): NavContextValue {
  const context = useContext(NavContext);
  if (Object.keys(context).length === 0) {
    throw new Error('useNavContext must be used within a NavProvider');
  }
  return context;
}

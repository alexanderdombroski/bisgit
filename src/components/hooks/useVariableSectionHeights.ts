import { useNav, type Section } from '../navigation';

export function useVariableSectionHeights(sectionList: Section[]) {
  const { activeSection } = useNav();

  const calcSectionHeight = (section: Section) => {
    if (!sectionList.includes(activeSection)) {
      return `${100 / sectionList.length}%`;
    }

    if (activeSection === section) {
      return getFocusHeight(sectionList.length);
    }

    return getInactiveHeight(sectionList.length);
  };

  return {
    calcSectionHeight,
  };
}

const getFocusHeight = (sectionCount: number) => {
  switch (sectionCount) {
    case 2:
      return '75%';
    case 3:
    case 4:
      return '50%';
    default:
      throw new Error(`Variable Section Height not configured for ${sectionCount}`);
  }
};

const getInactiveHeight = (sectionCount: number) => {
  switch (sectionCount) {
    case 2:
    case 3:
      return '25%';
    case 4:
      return '16.5%';
    default:
      throw new Error(`Variable Section Height not configured for ${sectionCount}`);
  }
};

type UseHeaderBrandStateParams = {
  pageTitle?: string;
  wordmarkHidden: boolean;
};

export function useHeaderBrandState({ pageTitle, wordmarkHidden }: UseHeaderBrandStateParams) {
  const showPageTitle = Boolean(pageTitle && wordmarkHidden);

  return {
    isCompact: wordmarkHidden,
    showPageTitle,
    wordmarkWidth: wordmarkHidden ? 0 : 192,
    wordmarkMarginLeft: wordmarkHidden ? 0 : 2,
    titleWidth: showPageTitle ? "auto" : 0,
    titleMarginLeft: showPageTitle ? 10 : 0,
  };
}



module.exports = ({ pageNumber, numberOfPages }) => {
  const navigationData = {
    currentPage: pageNumber,
    pagesBefore: {},
    pagesAfter: {},
  };

  // первая страница
  if (pageNumber > 3) {
    navigationData.firstPage = 1;
  }

  // точки до текущей
  if (pageNumber > 4) {
    navigationData.dotsBefore = true;
  }

  // страницы до текущей
  if (pageNumber > 1) {
    const pagesBefore = [];
    for (let i = 2; i > 0; i -= 1) {
      if (pageNumber - i === 0) {
        continue;
      }
      pagesBefore.push(pageNumber - i);
    }
    navigationData.pagesBefore = pagesBefore;
  }

  // страницы после текущей
  if (numberOfPages - pageNumber > 0) {
    const pagesAfter = [];
    for (let i = 1; i < 3; i += 1) {
      if (pageNumber + i > numberOfPages) {
        break;
      }
      pagesAfter.push(pageNumber + i);
    }
    navigationData.pagesAfter = pagesAfter;
  }

  // точки после текущей
  if (numberOfPages - pageNumber > 3) {
    navigationData.dotsAfter = true;
  }

  // последняя страница
  if (numberOfPages - pageNumber > 2) {
    navigationData.lastPage = numberOfPages;
  }

  return navigationData;
};

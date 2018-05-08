$(function () {

    // Elemek összegyűjtése
    // Megadható változók
    let pageSize = 50; // Ennyi cikk kerül 1 oldalra
    let renderableMaxPage = 10; // Az egyszerre kirajzolandó oldalgombok száma. 3-10 közötti érték adható meg.
    let sumArticle = 1000; // Ennyi cikket jelenít meg

    // JQuery változók
    let $contentWrapper = $('#content-wrapper');
    let $pagination = $('#pagination');
    let $firstPage = $('#first');
    let $prevPage = $('#prev');
    let $nextPage = $('#next');
    let $lastPage = $('#last');
    let $paginationButtons = $('');
    let $currentButton = $('');
    let $paginationLastButton = $('');
    let $buttonChanger = $('');
    let $lastButton = $('');

    // Program változók
    let maxPage = 0;
    let paginationHTMLArraySum = 0;
    let paginationHTMLArrayAverage = 0;
    let pageIndex = 0;
    let startPage = 0;
    let middlePaginationButton = 0;
    let buttonNew = 0;
    let paginationHtml = '';
    let firstLoad = true;
    let lastLoad = false;
    let currentBiggerAverage = false;
    let maxPageBiggerPagHTMLArrayMax = false;
    let notFirst = false;
    let currentSmallerAverage = false;
    let articleCollection = [];
    let paginationHTMLArray = [];
    let pinned = 0;
    let templateArtticle = {
        title: 'Mai hírek',
        body: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Alias laborum reprehenderit itaque est qui ab dolor, ipsum iste provident placeat asperiores, eos amet eveniet nulla quaerat enim dignissimos atque adipisci.'
    };

    // cikkek generálása
    for (let index = 0; index < sumArticle; index++) {
        articleCollection.push(templateArtticle);
    }

    // oldalak kiszámolása
    maxArtticle = articleCollection.length;
    maxPage = Math.ceil(maxArtticle / pageSize);
    if (maxPage < 11 | renderableMaxPage > maxPage) {
        renderableMaxPage = maxPage;
    }

    if (renderableMaxPage > 10 || renderableMaxPage < 3) {
        renderableMaxPage = 10;
        alert('A megadott értéknek 3-10 közé kell esnie!');
    }

    if (maxPage != 1) {
        calculatePaginator();
    }

    // Lapozó kiszámolás    
    function calculatePaginator() {
        paginationHTMLArray = [];
        for (let page = startPage; page < startPage + renderableMaxPage; page++) {
            RenderPagination(page);
        }

        $paginationButtons = $('div#pagination button');
        if (firstLoad) {
            $paginationLastButton = $('div#pagination button:first-child');
            $paginationLastButton.removeClass('btn-light').addClass('btn-primary');
            firstLoad = false;
            $firstPage.show().addClass('disabled');
            $prevPage.show().addClass('disabled');
            if (maxPage > 1) {
                $nextPage.show();
                $lastPage.show();
            }
        }
        if (lastLoad) {
            $paginationLastButton = $('div#pagination button:last-child');
            $paginationLastButton.removeClass('btn-light').addClass('btn-primary');
            lastLoad = false;
            $nextPage.addClass('disabled');
            $lastPage.addClass('disabled');
            $firstPage.removeClass('disabled');
            $prevPage.removeClass('disabled');
        }

        // Gombra reagálás
        $paginationButtons.click(function () {
            $currentButton = $(this);
            $paginationLastButton.removeClass('btn-primary').addClass('btn-light');
            $paginationLastButton = $currentButton;
            $currentButton.removeClass('btn-light').addClass('btn-primary');
            pageIndex = $currentButton.text();
            middlePaginationButton = Math.round(renderableMaxPage / 2);
            currentBiggerAverage = pageIndex > paginationHTMLArrayAverage;
            maxPageBiggerPagHTMLArrayMax = maxPage > paginationHTMLArray[(renderableMaxPage - 1)];
            notFirst = paginationHTMLArray[0] != 1;
            currentSmallerAverage = pageIndex < paginationHTMLArrayAverage;

            // Újra kell-e rajzolni a paginatort?
            if ((currentBiggerAverage && maxPageBiggerPagHTMLArrayMax) || (notFirst && currentSmallerAverage)) {
                // Ha az elején vagyunk
                if (pageIndex - middlePaginationButton < 0) {
                    startPage = 0;
                    $pagination.html('');
                    calculatePaginator();
                    $currentButton = $('div#pagination button:nth-child(' + pageIndex + ')');
                    $currentButton.removeClass('btn-light').addClass('btn-primary');
                    $lastButton = $currentButton;
                }
                // Ha a végén vagyunk
                else if (parseInt(pageIndex) + middlePaginationButton > maxPage) {
                    startPage = maxPage - renderableMaxPage;
                    $pagination.html('');
                    calculatePaginator();
                    $currentButton = $(this);
                    buttonNew = ($currentButton.text());
                    $buttonChanger = $('div#pagination button:contains(' + buttonNew + ')');
                    $buttonChanger.click();
                    $lastButton = $currentButton;
                }
                // Egyéb esetben
                else {
                    startPage = pageIndex - middlePaginationButton;
                    $pagination.html('');
                    calculatePaginator();
                    $currentButton = $('div#pagination button:nth-child(' + middlePaginationButton + ')');
                    $currentButton.removeClass('btn-light').addClass('btn-primary');
                    $lastButton = $currentButton;
                }
            }
            // Ha nem kell újra rajzolni
            else {
                $currentButton.removeClass('btn-light').addClass('btn-primary');
                $lastButton.removeClass('btn-primary').addClass('btn-light');
                $lastButton = $('');
            }

            RenderPage(pageIndex);
            if (pageIndex != 1) {
                $firstPage.removeClass('disabled');
                $prevPage.removeClass('disabled');
            }
            else {
                $firstPage.addClass('disabled');
                $prevPage.addClass('disabled');
            }
            if (pageIndex != maxPage) {
                $nextPage.removeClass('disabled');
                $lastPage.removeClass('disabled');
            }
            else {
                $nextPage.addClass('disabled');
                $lastPage.addClass('disabled');
            }
        });
    };

    // lapozó kirajzolás
    function RenderPagination(page) {
        paginationHtml = '<button type="button" class="btn btn-light" style="width: 50px">' + (page + 1) + '</button>';
        paginationHTMLArray.push(page + 1);
        paginationHTMLArraySum = paginationHTMLArray.reduce((x, y) => x + y);
        paginationHTMLArrayAverage = paginationHTMLArraySum / paginationHTMLArray.length;
        $pagination.append(paginationHtml);
    }

    // First (<<) gombra kattintás
    $firstPage.click(function () {
        firstLoad = true;
        pageIndex = 1;
        RenderPage(pageIndex);
        startPage = 0;
        $pagination.html('');
        paginationHTMLArray = [];
        $nextPage.removeClass('disabled');
        $lastPage.removeClass('disabled');
        calculatePaginator();
    });

    // Prev (<) gombra kattintás
    $prevPage.click(function () {
        if (parseInt(pageIndex) != 1) {
            buttonNew = parseInt(pageIndex) - 1;
            $buttonChanger = $('div#pagination button:contains(' + buttonNew + ')');
            if (parseInt(pageIndex) - 1 == 1) {
                $firstPage.click();
            }
            else {
                $buttonChanger.click();
            }
        }
    });

    // Next (>) gombra kattintás
    $nextPage.click(function () {
        if (parseInt(pageIndex) != maxPage) {
            if (parseInt(pageIndex) == 0) {
                buttonNew = parseInt(pageIndex) + 2;
                $buttonChanger = $('div#pagination button:contains(' + buttonNew + ')');
                $buttonChanger.click();
            }
            else {
                buttonNew = parseInt(pageIndex) + 1;
                $buttonChanger = $('div#pagination button:contains(' + buttonNew + ')');
                $buttonChanger.click();
            }
        }
    });

    // Last (>>) gombra kattintás
    $lastPage.click(function () {
        lastLoad = true;
        pageIndex = maxPage;
        RenderPage(pageIndex);
        startPage = maxPage - renderableMaxPage;
        $pagination.html('');
        paginationHTMLArray = [];
        calculatePaginator();
    });

    RenderPage(1);

    function RenderPage(pageIndex) {
        $contentWrapper.html('');
        if (pageIndex != maxPage || articleCollection.length % pageSize == 0) {
            for (
                let index = (pageIndex - 1) * pageSize;
                index < pageIndex * pageSize;
                index++
            ) {
                RenderArticle(index);
            }
        }
        else {
            for (
                let index = (pageIndex - 1) * pageSize;
                index < (pageIndex * pageSize) - ((pageSize) - (articleCollection.length % pageSize));
                index++
            ) {
                RenderArticle(index);
            }
        }
    };

    function RenderArticle(index) {
        let article = articleCollection[index];
        let articleHtml = '<div><strong id=cikk' + (index + 1) + '>' + article.title + ' (' + (index + 1) + ')</strong><p>'
            // let articleHtml = '<div><strong>' + article.title + ' (' + (index + 1) + ')</strong><p>'
            + article.body + '</p></div>';
        $contentWrapper.append(articleHtml);
    };
});
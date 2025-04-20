
describe('Тесты для страницы конструктора бургеров', () => {
  beforeEach(() => {
    // Перехватываем запросы на получение ингредиентов
    cy.intercept('/api/ingredients', {
      fixture: '../fixtures/ingredients.json'
    }).as('getIngredients');
  });

  it('сервис должен быть доступен по адресу localhost:5173', function () {
    cy.visit('/');
  });

  it('Неавторизованный пользователь заходит на страницу и собирает бургер', () => {
    cy.intercept('/api/auth/user', {
      fixture: '../fixtures/user-not-auth.json'
    }).as('unauthorizedUser');

    cy.visit('/');
    // Ждем пока придут ингредиенты
    cy.wait('@getIngredients').then(() => {
      // Добавляем булку, пару начинок и соус
      findButtonInLiByIngredientIdInLinkAndClick('643d69a5c3f7b9001cfa093d');
      findButtonInLiByIngredientIdInLinkAndClick('643d69a5c3f7b9001cfa0945');
      findButtonInLiByIngredientIdInLinkAndClick('643d69a5c3f7b9001cfa0948');
      findButtonInLiByIngredientIdInLinkAndClick('643d69a5c3f7b9001cfa094a');

      // Проверяем появление ингредиентов в конструкторе
      cy.get('.constructor-element__text').should('have.length', 5);
      constructorElementWithTextShouldExists(
        'Флюоресцентная булка R2-D3 (верх)'
      );
      constructorElementWithTextShouldExists(
        'Флюоресцентная булка R2-D3 (низ)'
      );
      constructorElementWithTextShouldExists('Сыр с астероидной плесенью');
      constructorElementWithTextShouldExists(
        'Соус с шипами Антарианского плоскоходца'
      );
      constructorElementWithTextShouldExists(
        'Кристаллы марсианских альфа-сахаридов'
      );
    });
  });

  it('Модальное окно описания ингредиента открывается и закрывается по клику на крестик', () => {
    cy.intercept('/api/auth/user', {
      fixture: '../fixtures/user-not-auth.json'
    }).as('unauthorizedUser');

    cy.visit('/');
    // Ждем пока придут ингредиенты
    cy.wait('@getIngredients').then(() => {
      // модального окна нет
      cy.get('#modals').should('be.empty');
      //Кликаем на ингредиент
      cy.get('a[href="/ingredients/643d69a5c3f7b9001cfa094a"]').click();
      // модальное окно должно открыться
      cy.get('#modals').should('not.be.empty');
      // и содержать в себе описание продукта
      cy.contains('Описание ингредиента').should('exist');
      cy.contains('Сыр с астероидной плесенью').should('exist');

      // кликаем на крестик
      cy.get('[data-testid="close-modal-button"]').click();
      // Проверяем, что модальное окно закрылось
      cy.get('#modals').should('be.empty');
      // проверяем что модальное окно с описанием открылось
    });
  });

  it('Модальное окно описания ингредиента закрывается по клику на оверлей', () => {
    cy.intercept('/api/auth/user', {
      fixture: '../fixtures/user-not-auth.json'
    }).as('unauthorizedUser');

    cy.visit('/');
    // Ждем пока придут ингредиенты
    cy.wait('@getIngredients').then(() => {
      // модального окна нет
      cy.get('#modals').should('be.empty');
      //Кликаем на ингредиент
      cy.get('a[href="/ingredients/643d69a5c3f7b9001cfa094a"]').click();
      // модальное окно должно открыться
      cy.get('#modals').should('not.be.empty');
      // и содержать в себе описание продукта
      cy.contains('Описание ингредиента').should('exist');
      cy.contains('Сыр с астероидной плесенью').should('exist');

      // кликаем на оверлей
      cy.get('[data-testid="overlay-element"]').click({ force: true });
      // Проверяем, что модальное окно закрылось
      cy.get('#modals').should('be.empty');
      // проверяем что модальное окно с описанием открылось
    });
  });

  it('Создание заказа', () => {
    cy.intercept('POST', '/api/orders', {
      fixture: '../fixtures/created-order.json',
      delay: 500 // Задержка в 500 ms чтобы проверить отображение preloader
    }).as('createdOrder');

    cy.intercept('/api/auth/user', {
      fixture: '../fixtures/user-auth.json'
    }).as('user');

    cy.window().then((win) => {
      cy.stub(win.localStorage, 'getItem').callsFake((key) => {
        if (key === 'refreshToken') {
          return 'mocked_refresh_token';
        }
        return null;
      });
    });
    cy.window().then((win) => {
      cy.stub(win.document, 'cookie').get(() => {
        return 'accessToken=mocked_access_token;';
      });
    });

    cy.visit('/');
    // Ждем пока придут ингредиенты
    cy.wait('@getIngredients').then(() => {
      // модального окна нет
      cy.get('#modals').should('be.empty');
      // собираем заказ
      findButtonInLiByIngredientIdInLinkAndClick('643d69a5c3f7b9001cfa093d');
      findButtonInLiByIngredientIdInLinkAndClick('643d69a5c3f7b9001cfa0945');
      findButtonInLiByIngredientIdInLinkAndClick('643d69a5c3f7b9001cfa0948');
      findButtonInLiByIngredientIdInLinkAndClick('643d69a5c3f7b9001cfa094a');

      //Кликаем на кнопку Оформить заказ
      cy.get('[data-testid="create-order-button"]').click();
       
      // модальное окно должно открыться
      cy.get('#modals').should('not.be.empty');
      // и содержать в себе описание продукта
      cy.contains('Оформляем заказ').should('exist');

      cy.wait('@createdOrder').then(() => {
        // проверяем, что номер заказа из ответа
        cy.contains('[data-testid="id-of-order"]', '999999').should('exist');
        // кликаем на крестик
        cy.get('[data-testid="close-modal-button"]').click();
        // Проверяем, что модальное окно закрылось
        cy.get('#modals').should('be.empty');
        // Проверяем очистку ингредиентов в конструкторе
        cy.get('.constructor-element__text').should('have.length', 0);
      });
    });
  });
});

const findButtonInLiByIngredientIdInLinkAndClick = (ingredientId: string) => {
  cy.get('a[href="/ingredients/' + ingredientId + '"]')
    .parent('li')
    .find('button')
    .click();
};

const constructorElementWithTextShouldExists = (
  text: string,
  count: number = 1
) => {
  cy.get('.constructor-element__text')
    .contains(text)
    .should('exist')
    .should('have.length', count);
};

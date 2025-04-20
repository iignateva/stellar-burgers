import { expect, describe } from '@jest/globals';
import { rootReducer } from './store';
import {
  constructorItemsSlice,
  createOrder,
  getIngredients,
  getUser,
  ingredientsSlice,
  orderRequestSlice,
  profileSlice,
  updateUser,
  userLogin,
  userLogout,
  userRegister
} from './slices';
import { configureStore } from '@reduxjs/toolkit';

// Тестовый стейт для каждого слайса
const expectedIngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

const expectedConstructorItemsState = {
  ingredients: [],
  bun: null
};

const expectedProfileState = {
  isLoading: false,
  isLoggedIn: false,
  user: {
    email: '',
    name: ''
  },
  error: null
};

const expectedFeedsState = {
  orders: [],
  profileOrders: [],
  selectedOrder: null,
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

const expectedOrderRequestState = {
  orderRequest: false,
  orderModalData: null,
  inProcess: false,
  error: null,
  result: null,
  name: null
};

const expectedInitialState = {
  ingredients: expectedIngredientsState,
  constructorItems: expectedConstructorItemsState,
  profile: expectedProfileState,
  feeds: expectedFeedsState,
  orderRequest: expectedOrderRequestState
};

describe('rootReducer', () => {
  it('should initialize correctly', () => {
    const action = { type: 'UNKNOWN_ACTION' }; // Неизвестное действие
    const newState = rootReducer(expectedInitialState, action);

    // Проверка, что стейт не изменился
    expect(newState).toEqual(expectedInitialState);
    // Проверка, что стейт инициализировался правильно
    expect(newState.ingredients).toEqual(expectedIngredientsState);
    expect(newState.constructorItems).toEqual(expectedConstructorItemsState);
    expect(newState.profile).toEqual(expectedProfileState);
    expect(newState.feeds).toEqual(expectedFeedsState);
    expect(newState.orderRequest).toEqual(expectedOrderRequestState);
  });
});

describe('constructorItemsSlice', () => {
  const testItem1 = {
    _id: '643d69a5c3f7b9001cfa0948',
    name: 'Кристаллы марсианских альфа-сахаридов',
    type: 'main',
    proteins: 234,
    fat: 432,
    carbohydrates: 111,
    calories: 189,
    price: 762,
    image: 'https://code.s3.yandex.net/react/code/core.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/core-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/core-large.png'
  };

  it('обработка экшена добавления ингредиента', () => {
    const store = configureStore({
      reducer: constructorItemsSlice.reducer
    });

    store.dispatch(constructorItemsSlice.actions.addIngredient(testItem1));

    const ingreds = store.getState();
    // Проверяем, что стейт изменился корректно
    expect(ingreds).toEqual({
      bun: null,
      ingredients: [{ id: testItem1._id, ...testItem1 }]
    });
  });

  it('обработка экшена удаления ингредиента', () => {
    const store = configureStore({
      reducer: constructorItemsSlice.reducer,
      preloadedState: {
        bun: null,
        ingredients: [{ id: testItem1._id, ...testItem1 }]
      }
    });

    store.dispatch(constructorItemsSlice.actions.deleteIngredient(0));

    const ingreds = store.getState();
    // Проверяем, что стейт изменился - ингредиент удален
    expect(ingreds).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('обработка экшена изменения порядка ингредиентов в начинке', () => {
    const testItem2 = {
      _id: '643d69a5c3f7b9001cfa094a',
      name: 'Сыр с астероидной плесенью',
      type: 'main',
      proteins: 84,
      fat: 48,
      carbohydrates: 420,
      calories: 3377,
      price: 4142,
      image: 'https://code.s3.yandex.net/react/code/cheese.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/cheese-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/cheese-large.png'
    };
    const store = configureStore({
      reducer: constructorItemsSlice.reducer,
      preloadedState: {
        bun: null,
        ingredients: [
          { id: testItem1._id, ...testItem1 },
          { id: testItem2._id, ...testItem2 }
        ]
      }
    });

    store.dispatch(constructorItemsSlice.actions.moveDownIngredient(0));

    const ingreds = store.getState();
    // Проверяем, что стейт изменился - ингредиент2 переместился наверх
    expect(ingreds).toEqual({
      bun: null,
      ingredients: [
        { id: testItem2._id, ...testItem2 },
        { id: testItem1._id, ...testItem1 }
      ]
    });
  });
});

describe('ingredientsSlice', () => {
  const testIngredirents = [
    {
      _id: '643d69a5c3f7b9001cfa093d',
      name: 'Флюоресцентная булка R2-D3',
      type: 'bun',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/bun-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0945',
      name: 'Соус с шипами Антарианского плоскоходца',
      type: 'sauce',
      proteins: 101,
      fat: 99,
      carbohydrates: 100,
      calories: 100,
      price: 88,
      image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0948',
      name: 'Кристаллы марсианских альфа-сахаридов',
      type: 'main',
      proteins: 234,
      fat: 432,
      carbohydrates: 111,
      calories: 189,
      price: 762,
      image: 'https://code.s3.yandex.net/react/code/core.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/core-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/core-large.png'
    }
  ];
  it('тестирование состояния успешного получения ингредиентов', () => {
    const store = configureStore({
      reducer: ingredientsSlice.reducer
    });

    store.dispatch(getIngredients.fulfilled(testIngredirents, ''));

    const ingreds = store.getState();
    // Проверяем, что стейт изменился корректно
    expect(ingreds).toEqual({
      error: null,
      loading: false,
      ingredients: testIngredirents
    });
  });

  it('тестирование состояния ожидание загрузки ингредиентов', () => {
    const store = configureStore({
      reducer: ingredientsSlice.reducer
    });

    store.dispatch(getIngredients.pending(''));

    const ingreds = store.getState();
    // Проверяем, что стейт изменился корректно
    expect(ingreds).toEqual({
      error: null,
      loading: true,
      ingredients: []
    });
  });

  it('тестирование состояния ошибки при загрузке ингредиентов', () => {
    const store = configureStore({
      reducer: ingredientsSlice.reducer
    });

    store.dispatch(
      getIngredients.rejected(
        { name: 'some error', message: 'rejected because of error' },
        ''
      )
    );

    const ingreds = store.getState();
    // Проверяем, что стейт изменился корректно
    expect(ingreds).toEqual({
      error: 'rejected because of error',
      loading: false,
      ingredients: []
    });
  });
});

describe('orderRequestSlice', () => {
  const orderResponse = {
    success: true,
    name: 'Люминесцентный бургер',
    order: {
      ingredients: [],
      _id: '6804f20ce8e61d001cec395f',
      owner: {
        name: 'Irina I',
        email: 'irina@mail.ru',
        createdAt: '2025-03-13T20:25:23.044Z',
        updatedAt: '2025-04-20T09:34:23.250Z'
      },
      status: 'done',
      name: 'Люминесцентный бургер',
      createdAt: '2025-04-20T13:09:32.508Z',
      updatedAt: '2025-04-20T13:09:33.760Z',
      number: 999999,
      price: 988
    }
  };

  it('тестирование состояния успешной загрузки заказов', () => {
    const store = configureStore({
      reducer: orderRequestSlice.reducer
    });

    store.dispatch(createOrder.fulfilled(orderResponse, '', ['id1', 'id2']));

    const order = store.getState();
    // Проверяем, что стейт изменился корректно
    expect(order).toEqual({
      error: null,
      inProcess: false,
      result: orderResponse.order,
      orderModalData: orderResponse.order,
      name: orderResponse.name,
      orderRequest: false
    });
  });

  it('тестирование состояния ожидания загрузки заказов', () => {
    const store = configureStore({
      reducer: orderRequestSlice.reducer
    });

    store.dispatch(createOrder.pending('', ['id1', 'id2']));

    const order = store.getState();
    // Проверяем, что стейт изменился корректно
    expect(order).toEqual({
      orderRequest: false,
      orderModalData: null,
      inProcess: true,
      error: null,
      result: null,
      name: null
    });
  });

  it('тестирование состояния ошибки при загрузке заказов', () => {
    const store = configureStore({
      reducer: orderRequestSlice.reducer
    });

    store.dispatch(
      createOrder.rejected(
        { name: 'some error', message: 'rejected because of error' },
        '',
        ['id1', 'id2']
      )
    );

    const order = store.getState();
    // Проверяем, что стейт изменился корректно
    expect(order).toEqual({
      orderRequest: false,
      orderModalData: null,
      inProcess: false,
      error: 'rejected because of error',
      result: null,
      name: null
    });
  });
});

describe('profileSlice', () => {
  it('logout - fulfilled', () => {
    const store = configureStore({
      reducer: profileSlice.reducer,
      preloadedState: {
        isLoading: false,
        isLoggedIn: true,
        user: {
          email: 'email@email.ru',
          name: 'fio'
        },
        error: null
      }
    });

    store.dispatch(userLogout.fulfilled({ success: true }, ''));

    const profile = store.getState();
    // Проверяем, что стейт изменился корректно
    expect(profile).toEqual({
      isLoading: false,
      isLoggedIn: false,
      user: { name: '', email: '' },
      error: null
    });
  });

  it('logout - rejected', () => {
    const store = configureStore({
      reducer: profileSlice.reducer,
      preloadedState: {
        isLoading: false,
        isLoggedIn: true,
        user: {
          email: 'email@email.ru',
          name: 'fio'
        },
        error: null
      }
    });

    store.dispatch(
      userLogout.rejected(
        { name: 'some error', message: 'rejected because of error' },
        ''
      )
    );

    const profile = store.getState();
    // Проверяем, что стейт изменился корректно
    expect(profile).toEqual({
      isLoading: false,
      isLoggedIn: true,
      user: {
        email: 'email@email.ru',
        name: 'fio'
      },
      error: 'rejected because of error'
    });
  });

  const registerUserRequest = {
    email: 'email@email.ru',
    name: 'fio',
    password: 'pass'
  };

  it('register user - fulfilled', () => {
    const store = configureStore({
      reducer: profileSlice.reducer
    });

    store.dispatch(
      userRegister.fulfilled(
        {
          success: true,
          refreshToken: 'string',
          accessToken: 'string',
          user: {
            email: 'email@email.ru',
            name: 'fio'
          }
        },
        'request-id',
        registerUserRequest
      )
    );

    const profile = store.getState();
    // Проверяем, что стейт изменился корректно
    expect(profile).toEqual({
      isLoading: false,
      isLoggedIn: true,
      user: {
        email: 'email@email.ru',
        name: 'fio'
      },
      error: null
    });
  });

  it('register user - rejected', () => {
    const store = configureStore({
      reducer: profileSlice.reducer
    });

    store.dispatch(
      userRegister.rejected(
        { name: 'some error', message: 'error message' },
        'request-id',
        registerUserRequest
      )
    );

    const profile = store.getState();
    // Проверяем, что стейт изменился корректно
    expect(profile).toEqual({
      isLoading: false,
      isLoggedIn: false,
      user: {
        email: '',
        name: ''
      },
      error: 'error message'
    });
  });

  it('register user - pending', () => {
    const store = configureStore({
      reducer: profileSlice.reducer
    });

    store.dispatch(userRegister.pending('request-id', registerUserRequest));

    const profile = store.getState();
    // Проверяем, что стейт изменился корректно
    expect(profile).toEqual({
      isLoading: true,
      isLoggedIn: false,
      user: {
        email: '',
        name: ''
      },
      error: null
    });
  });

  const userLoginRequest = {
    email: 'email@email.ru',
    password: 'pass'
  }; 

  it('user login - fulfilled', () => {
    const store = configureStore({
      reducer: profileSlice.reducer
    });

    store.dispatch(
      userLogin.fulfilled(
        {
          success: true,
          refreshToken: 'string',
          accessToken: 'string',
          user: {
            email: 'email@email.ru',
            name: 'fio'
          }
        },
        'request-id',
        userLoginRequest
      )
    );

    const profile = store.getState();
    // Проверяем, что стейт изменился корректно
    expect(profile).toEqual({
      isLoading: false,
      isLoggedIn: true,
      user: {
        email: 'email@email.ru',
        name: 'fio'
      },
      error: null
    });
  });

  it('user login - rejected', () => {
    const store = configureStore({
      reducer: profileSlice.reducer
    });

    store.dispatch(
      userLogin.rejected(
        { name: 'some error', message: 'error message' },
        'request-id',
        userLoginRequest
      )
    );

    const profile = store.getState();
    // Проверяем, что стейт изменился корректно
    expect(profile).toEqual({
      isLoading: false,
      isLoggedIn: false,
      user: {
        email: '',
        name: ''
      },
      error: 'error message'
    });
  });

  it('user login - pending', () => {
    const store = configureStore({
      reducer: profileSlice.reducer
    });

    store.dispatch(userLogin.pending('request-id', userLoginRequest));

    const profile = store.getState();
    // Проверяем, что стейт изменился корректно
    expect(profile).toEqual({
      isLoading: true,
      isLoggedIn: false,
      user: {
        email: '',
        name: ''
      },
      error: null
    });
  });

  it('get user - fulfilled', () => {
    const store = configureStore({
      reducer: profileSlice.reducer
    });

    store.dispatch(
      getUser.fulfilled(
        {
          success: true,
          user: {
            email: 'email@email.ru',
            name: 'fio'
          }
        },
        'request-id'
      )
    );

    const profile = store.getState();
    // Проверяем, что стейт изменился корректно
    expect(profile).toEqual({
      isLoading: false,
      isLoggedIn: true,
      user: {
        email: 'email@email.ru',
        name: 'fio'
      },
      error: null
    });
  });

  it('get user - rejected', () => {
    const store = configureStore({
      reducer: profileSlice.reducer
    });

    store.dispatch(
      getUser.rejected(
        { name: 'some error', message: 'error message' },
        'request-id'
      )
    );

    const profile = store.getState();
    // Проверяем, что стейт изменился корректно
    expect(profile).toEqual({
      isLoading: false,
      isLoggedIn: false,
      user: {
        email: '',
        name: ''
      },
      error: 'error message'
    });
  });

  it('get user - pending', () => {
    const store = configureStore({
      reducer: profileSlice.reducer
    });

    store.dispatch(
      getUser.pending('request-id')
    );

    const profile = store.getState();
    // Проверяем, что стейт изменился корректно
    expect(profile).toEqual({
      isLoading: true,
      isLoggedIn: false,
      user: {
        email: '',
        name: ''
      },
      error: null
    });
  });

  const preloadedProfileState = {
    isLoading: false,
    isLoggedIn: true,
    user: {
      email: 'email@email.ru',
      name: 'fio'
    },
    error: null
  };

  const updateUserRequest = {
    email: 'email@email.ru',
    name: 'fio'
  };

  it('update user - fulfilled', () => {
    const store = configureStore({
      reducer: profileSlice.reducer,
      preloadedState: preloadedProfileState
    });

    store.dispatch(
      updateUser.fulfilled(
        {
          success: true,
          user: {
            email: 'email222@email.ru',
            name: 'fio222'
          }
        },
        'request-id',
        updateUserRequest
      )
    );

    const profile = store.getState();
    // Проверяем, что стейт изменился корректно
    expect(profile).toEqual({
      isLoading: false,
      isLoggedIn: true,
      user: {
        email: 'email222@email.ru',
        name: 'fio222'
      },
      error: null
    });
  });

  it('update user - rejected', () => {
    const store = configureStore({
      reducer: profileSlice.reducer,
      preloadedState: preloadedProfileState
    });

    store.dispatch(
      updateUser.rejected(
        { name: 'some error', message: 'error message' },
        'request-id',
        updateUserRequest
      )
    );

    const profile = store.getState();
    // Проверяем, что стейт изменился корректно
    expect(profile).toEqual({
      isLoading: false,
      isLoggedIn: true,
      user: {
        email: 'email@email.ru',
        name: 'fio'
      },
      error: 'error message'
    });
  });

  it('update user - pending', () => {
    const store = configureStore({
      reducer: profileSlice.reducer,
      preloadedState: preloadedProfileState
    });

    store.dispatch(updateUser.pending('request-id', updateUserRequest));

    const profile = store.getState();
    // Проверяем, что стейт изменился корректно
    expect(profile).toEqual({
      isLoading: true,
      isLoggedIn: true,
      user: {
        email: 'email@email.ru',
        name: 'fio'
      },
      error: null
    });
  });

});

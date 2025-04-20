import {
  TLoginData,
  TRegisterData,
  getFeedsApi,
  getIngredientsApi,
  getOrderByNumberApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  TConstructorIngredient,
  TIngredient,
  TOrder,
  TUser
} from '@utils-types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setCookie } from '../utils/cookie';

export type TIngredientState = {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: TIngredientState = {
  ingredients: [],
  loading: false,
  error: null
};

export const getIngredients = createAsyncThunk(
  'ingredients/getAll',
  getIngredientsApi
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    isIngredientsLoadingSelector: (state) => state.loading,
    ingredientsSelector: (state) => state.ingredients
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      });
  }
});

export type TConstructorItems = {
  ingredients: TConstructorIngredient[];
  bun: TConstructorIngredient | null;
};

const initialConstructorItems: TConstructorItems = {
  ingredients: [],
  bun: null
};

export const constructorItemsSlice = createSlice({
  name: 'constructorItems',
  initialState: initialConstructorItems,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = { id: action.payload._id, ...action.payload };
      } else {
        state.ingredients.push({ id: action.payload._id, ...action.payload });
      }
    },
    deleteIngredient: (state, action: PayloadAction<number>) => {
      state.ingredients.splice(action.payload, 1);
    },
    moveUpIngredient: (state, action: PayloadAction<number>) => {
      const previosEl = state.ingredients[action.payload - 1];
      state.ingredients.splice(action.payload + 1, 0, previosEl);
      state.ingredients.splice(action.payload - 1, 1);
    },
    moveDownIngredient: (state, action: PayloadAction<number>) => {
      const currentEl = state.ingredients[action.payload];
      state.ingredients.splice(action.payload + 2, 0, currentEl);
      state.ingredients.splice(action.payload, 1);
    },
    clearConstructorItems: (state) => {
      state.ingredients = [];
      state.bun = null;
    }
  },
  selectors: {
    constructorItemsSelector: (state) => state
  }
});

export type TOrderRequest = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  inProcess: boolean;
  error: string | null;
  result: TOrder | null;
  name: string | null;
};

const initialOrderRequest: TOrderRequest = {
  orderRequest: false,
  orderModalData: null,
  inProcess: false,
  error: null,
  result: null,
  name: null
};

export const createOrder = createAsyncThunk(
  'orders',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    if (!response.success) {
      return Promise.reject(response);
    }
    return response;
  }
);

export const orderRequestSlice = createSlice({
  name: 'orderRequest',
  initialState: initialOrderRequest,
  reducers: {
    sentOrderRequest: (state) => {
      state.orderRequest = true;
    },
    orderRequestDone: (state) => {
      state.orderRequest = false;
      state.error = null;
      state.inProcess = false;
      state.name = null;
      state.result = null;
      state.orderModalData = null;
    }
  },
  selectors: {
    orderRequestSelector: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.inProcess = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.inProcess = false;
        state.error = action.error.message || null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.inProcess = false;
        state.result = action.payload.order;
        state.name = action.payload.name;
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
      });
  }
});

export type TProfile = {
  isLoading: boolean;
  isLoggedIn: boolean;
  user: TUser;
  error: string | null;
};

const profileInitial: TProfile = {
  isLoading: false,
  isLoggedIn: false,
  user: {
    email: '',
    name: ''
  },
  error: null
};

export const userLogout = createAsyncThunk('user/logout', logoutApi);

export const userRegister = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    if (response.success) {
      saveTokens(response.accessToken, response.refreshToken);
    } else {
      return Promise.reject(response);
    }
    return response;
  }
);

export const userLogin = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    if (response.success) {
      saveTokens(response.accessToken, response.refreshToken);
    } else {
      return Promise.reject(response);
    }
    return response;
  }
);

export const getUser = createAsyncThunk('user/get', async () => {
  const response = await getUserApi();
  if (response.success) {
    return response;
  } else {
    return Promise.reject(response);
  }
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => {
    const response = await updateUserApi(user);
    if (response.success) {
      return response;
    } else {
      return Promise.reject(response);
    }
  }
);

export const getUserOrders = createAsyncThunk('user/orders', getOrdersApi);

const saveTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState: profileInitial,
  reducers: {
    init: (state) => {
      state.isLoggedIn = false;
    }
  },
  selectors: {
    profileSelector: (state) => state,
    userSelector: (state) => ({
      user: state.user,
      isLoggedIn: state.isLoggedIn
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogout.rejected, (state, action) => {
        state.error = action.error.message || null;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = { name: '', email: '' };
        state.isLoading = false;
      })
      .addCase(userRegister.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userRegister.rejected, (state, actual) => {
        state.isLoading = false;
        state.error = actual.error.message || null;
        state.isLoggedIn = false;
        state.user = { name: '', email: '' };
      })
      .addCase(userRegister.fulfilled, (state, actual) => {
        state.isLoading = false;
        state.user = actual.payload.user;
        state.isLoggedIn = true;
      })
      .addCase(userLogin.pending, (state) => {
        state.isLoading = true;
        state.isLoggedIn = false;
      })
      .addCase(userLogin.rejected, (state, actual) => {
        state.isLoading = false;
        state.error = actual.error.message || null;
        state.isLoggedIn = false;
      })
      .addCase(userLogin.fulfilled, (state, actual) => {
        state.isLoading = false;
        state.user = actual.payload.user;
        state.isLoggedIn = true;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.isLoggedIn = false;
      })
      .addCase(getUser.rejected, (state, actual) => {
        state.isLoading = false;
        state.error = actual.error.message || null;
        state.isLoggedIn = false;
        state.user = { name: '', email: '' };
      })
      .addCase(getUser.fulfilled, (state, actual) => {
        state.isLoading = false;
        state.user = actual.payload.user;
        state.isLoggedIn = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.rejected, (state, actual) => {
        state.isLoading = false;
        state.error = actual.error.message || null;
      })
      .addCase(updateUser.fulfilled, (state, actual) => {
        state.isLoading = false;
        state.user = actual.payload.user;
      });
  }
});

export type TFeedsState = {
  orders: TOrder[];
  profileOrders: TOrder[];
  selectedOrder: TOrder | null;
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

const feedInitialState: TFeedsState = {
  orders: [],
  profileOrders: [],
  selectedOrder: null,
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const getFeeds = createAsyncThunk('orders/all', getFeedsApi);

export const getOrderByNumber = createAsyncThunk(
  'orders/getById',
  async (orderNumber: number) => getOrderByNumberApi(orderNumber)
);

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState: feedInitialState,
  reducers: {},
  selectors: {
    feedsSelector: (state) => state,
    orderInfoSelector: (state) => state.selectedOrder
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getUserOrders.rejected, (state, actual) => {
        state.error = actual.error.message || null;
      })
      .addCase(getUserOrders.fulfilled, (state, actual) => {
        state.profileOrders = actual.payload;
        if (state.orders.length === 0) {
          state.orders = actual.payload;
        }
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload.orders[0] || null;
      });
  }
});

export const { ingredientsSelector, isIngredientsLoadingSelector } =
  ingredientsSlice.selectors;
export const { constructorItemsSelector } = constructorItemsSlice.selectors;
export const { profileSelector, userSelector } = profileSlice.selectors;
export const { feedsSelector, orderInfoSelector } = feedsSlice.selectors;
export const { orderRequestSelector } = orderRequestSlice.selectors;

export const {
  addIngredient,
  deleteIngredient,
  moveUpIngredient,
  moveDownIngredient,
  clearConstructorItems
} = constructorItemsSlice.actions;
export const { init } = profileSlice.actions;
export const { sentOrderRequest, orderRequestDone } = orderRequestSlice.actions;

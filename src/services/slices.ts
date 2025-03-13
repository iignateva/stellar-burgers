import {
  TLoginData,
  TRegisterData,
  getIngredientsApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TUser } from '@utils-types';
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

export const getIngredients = createAsyncThunk('ingredients/getAll', async () =>
  getIngredientsApi()
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
    }
  },
  selectors: {
    constructorItemsSelector: (state) => state
  }
});

export type TProfile = {
  isLoading: boolean;
  isLoggedIn: boolean;
  user: TUser;
  error: string | null;
  password: string | null;
};

const profileInitial: TProfile = {
  isLoading: false,
  isLoggedIn: false,
  user: {
    email: '',
    name: ''
  },
  password: null,
  error: null
};

export const userLogout = createAsyncThunk('user/logout', async () =>
  logoutApi()
);

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
        state.password = null;
      })
      .addCase(userRegister.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userRegister.rejected, (state, actual) => {
        state.isLoading = false;
        state.error = actual.error.message || null;
        state.isLoggedIn = false;
        state.user = { name: '', email: '' };
        state.password = null;
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
        state.password = null;
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

export const { ingredientsSelector, isIngredientsLoadingSelector } =
  ingredientsSlice.selectors;

export const { constructorItemsSelector } = constructorItemsSlice.selectors;
export const { profileSelector, userSelector } = profileSlice.selectors;

export const { addIngredient } = constructorItemsSlice.actions;
export const { init } = profileSlice.actions;

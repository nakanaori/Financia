import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import LoginComponent from "./IntroScreen/LoginComponent";
import SignUpComponent from "./IntroScreen/SignUpComponent";
import SwiperComponent from "./IntroScreen/SwiperComponent";
import HomeComponent from "./IntroScreen/HomeComponent";
import Income from "./menu/Income";
import Expense from "./menu/Expense";
import Saving from "./menu/Saving";
import AccountReceivable from "./menu/AccountReceivable";
import AccountPayable from "./menu/AccountPayable";
import addIncome from "./menu/addData/addIncome";
import IncomeDetails from "./menu/details/incomeDetails";
import IncomeHistory from "./menu/history/incomeHistory";
import IncomeUpdate from "./menu/update/IncomeUpdate";
import addExpense from "./menu/addData/addExpense";
import ExpenseDetails from "./menu/details/expenseDetails";
import ExpenseHistory from "./menu/history/expenseHistory";
import ExpenseUpdate from "./menu/update/expenseUpdate";
import ShowPicture from "./menu/details/ShowPicture";
import addAccountReceivable from "./menu/addData/addAccountReceivable";
import AccountReceivableDetails from "./menu/details/accountReceivableDetails";
import AccountReceivableHistory from "./menu/history/accountReceivableHistory";
import AccountReceivableUpdate from "./menu/update/accountReceivableUpdate";
import addSaving from "./menu/addData/addSaving";
import SavingDetails from "./menu/details/savingDetails";
import SavingHistory from "./menu/history/savingHistory";
import SavingUpdate from "./menu/update/SavingUpdate";
import addAccountPayable from "./menu/addData/addAccountPayable";
import AccountPayableDetails from "./menu/details/AccountPayableDetails";
import AccountPayableHistory from "./menu/history/AccountPayableHistory";
import AccountPayableUpdate from "./menu/update/accountPayableUpdate";
import ForgetPassword from "./IntroScreen/forgetPassword"

const LoginStack = createStackNavigator(
  {
    SwiperScreen: {
      screen: SwiperComponent,
      navigationOptions: {
        headerShown: false,
      },
    },
    LoginScreen: {
      screen: LoginComponent,
      navigationOptions: {
        headerShown: false,
      },
    },
    ForgetPasswordScreen : {
        screen : ForgetPassword,
        navigationOptions : {
            title : 'Forget Password'
        }
    },
    SignUpScreen: {
        screen: SignUpComponent,
        navigationOptions: {
          headerShown: false,
        },
      },
  },
  { initialRouteName: "SwiperScreen" }
);

const HomeStack = createStackNavigator(
  {
    HomeScreen: {
      screen: HomeComponent,
      navigationOptions: {
        headerShown: false,
      },
    },
    IncomeScreen: {
      screen: Income,
      navigationOptions: {
        headerShown: false,
      },
    },
    addIncomeScreen: {
      screen: addIncome,
      navigationOptions: {
        headerShown: false,
      },
    },
    IncomeDetails: {
      screen: IncomeDetails,
      navigationOptions: {
        headerShown: false,
      },
    },
    IncomeHistoryScreen: {
      screen: IncomeHistory,
      navigationOptions: {
        headerShown: false,
      },
    },
    IncomeUpdateScreen: {
      screen: IncomeUpdate,
      navigationOptions: {
        headerShown: false,
      },
    },
    ExpenseScreen: {
      screen: Expense,
      navigationOptions: {
        headerShown: false,
      },
    },
    addExpenseScreen: {
      screen: addExpense,
      navigationOptions: {
        headerShown: false,
      },
    },
    ExpenseDetails: {
      screen: ExpenseDetails,
      navigationOptions: {
        headerShown: false,
      },
    },
    ExpenseHistoryScreen: {
      screen: ExpenseHistory,
      navigationOptions: {
        headerShown: false,
      },
    },
    ExpenseUpdateScreen: {
      screen: ExpenseUpdate,
      navigationOptions: {
        headerShown: false,
      },
    },
    ShowPictureScreen: {
      screen: ShowPicture,
      navigationOptions: {
        headerShown: false,
      },
    },
    addAccountReceivableScreen: {
      screen: addAccountReceivable,
      navigationOptions: {
        headerShown: false,
      },
    },
    AccountReceivableDetails: {
      screen: AccountReceivableDetails,
      navigationOptions: {
        headerShown: false,
      },
    },
    AccountReceivableHistoryScreen: {
      screen: AccountReceivableHistory,
      navigationOptions: {
        headerShown: false,
      },
    },
    AccountReceivableUpdateScreen: {
      screen: AccountReceivableUpdate,
      navigationOptions: {
        headerShown: false,
      },
    },
    AccountReceivableScreen: {
      screen: AccountReceivable,
      navigationOptions: {
        headerShown: false,
      },
    },

    addSavingScreen: {
      screen: addSaving,
      navigationOptions: {
        headerShown: false,
      },
    },
    SavingDetails: {
      screen: SavingDetails,
      navigationOptions: {
        headerShown: false,
      },
    },
    SavingHistoryScreen: {
      screen: SavingHistory,
      navigationOptions: {
        headerShown: false,
      },
    },
    SavingUpdateScreen: {
      screen: SavingUpdate,
      navigationOptions: {
        headerShown: false,
      },
    },
    SavingScreen: {
      screen: Saving,
      navigationOptions: {
        headerShown: false,
      },
    },

    addAccountPayableScreen: {
      screen: addAccountPayable,
      navigationOptions: {
        headerShown: false,
      },
    },
    AccountPayableDetails: {
      screen: AccountPayableDetails,
      navigationOptions: {
        headerShown: false,
      },
    },
    AccountPayableHistoryScreen: {
      screen: AccountPayableHistory,
      navigationOptions: {
        headerShown: false,
      },
    },
    AccountPayableUpdateScreen: {
      screen: AccountPayableUpdate,
      navigationOptions: {
        headerShown: false,
      },
    },
    AccountPayableScreen: {
      screen: AccountPayable,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  { initialRouteName: "HomeScreen" }
);

const Navigator = createSwitchNavigator(
    {
      LoginStack,
      HomeStack,
    },
    {
      headerMode: "none",
      initialRouteName: "LoginStack",
    }
  );

export default createAppContainer(Navigator);

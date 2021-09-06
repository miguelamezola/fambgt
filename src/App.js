// import logo from './logo.svg';
import './App.css';
import { PageLayout } from './PageLayout/PageLayout';
import { BudgetMaker } from './BudgetMaker/BudgetMaker';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";

function App() {
  return (
    <PageLayout className="App">
      <UnauthenticatedTemplate>
        <div className="pt-5 text-center">You are not signed in!  Please sign in to proceed.</div>
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <BudgetMaker />
      </AuthenticatedTemplate>
    </PageLayout>
  );
}

export default App;

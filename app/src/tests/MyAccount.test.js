import React from "react";
import { act, fireEvent, queryByText, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import MyAccout from "../pages/MyAccout";

// Mock dependencies
jest.mock("../components/Navbar", () => () => <div>Navbar</div>)
jest.mock("../components/Footer", () => () => <div>Footer</div>)
jest.mock("../components/Loading", () => () => <div>Loading...</div>)
jest.mock("../styles/MyAccount.module.css", () => ({}))

class sessionStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value;
  }

  removeItem(key) {
    delete this.store[key];
  }
}
global.sessionStorage = new sessionStorageMock;

function renderPage(){
    return  render(
      <MemoryRouter initialEntries={[{ pathname: "/my-account" }]}>
        <Routes>
          <Route path="/my-account" element={<MyAccout/>} />
        </Routes>
      </MemoryRouter>
    )
}

describe("MyAccount page", () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it("renders without crashing", async () => {
    sessionStorage.setItem("loggedUser", JSON.stringify({
        id: 1,
        email: "test@gmail.com",
        password: "123"
    }))
    sessionStorage.setItem("users", JSON.stringify([
        {
            id: 1,
            email: "test@gmail.com",
            password: "123"
        }
    ]))
    renderPage()
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    const title = screen.getByText("Minha Conta")
    expect(title).toBeInTheDocument()
  })

  it("prevents updating account with invalid email and phone", async () => {
    sessionStorage.setItem("loggedUser", JSON.stringify({
        id: 1,
        email: "test@gmail.com",
        password: "123"
    }))
    sessionStorage.setItem("users", JSON.stringify([
        {
            id: 1,
            email: "test@gmail.com",
            password: "123"
        }
    ]))
    renderPage()
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    const nameInput = screen.getByLabelText("Nome:")
    const addressInput = screen.getByLabelText("Endereço:")
    const phoneInput = screen.getByLabelText("Telefone:")
    const emailInput = screen.getByLabelText("Email:")
    const passwordInput = screen.getByLabelText("Senha:")
    const submitBtn = screen.getByText("Atualizar")

    fireEvent.change(nameInput, { target: { value: "Teste da Silva" } })
    fireEvent.change(addressInput, { target: { value: "Rua do Teste" } })
    fireEvent.change(phoneInput, { target: { value: "321" } })
    fireEvent.change(emailInput, { target: { value: "teste" } })
    fireEvent.change(passwordInput, { target: { value: "123" } })
    fireEvent.click(submitBtn)
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    
    const error = screen.queryByText("Email inválido e Telefone inválido")
    expect(error).not.toBeNull()
  })

  it("allows registering with valid data", async () => {
    sessionStorage.setItem("loggedUser", JSON.stringify({
        id: 1,
        email: "test@gmail.com",
        password: "123"
    }))
    sessionStorage.setItem("users", JSON.stringify([
        {
            id: 1,
            email: "test@gmail.com",
            password: "123"
        }
    ]))
    renderPage()
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    const nameInput = screen.getByLabelText("Nome:")
    const addressInput = screen.getByLabelText("Endereço:")
    const phoneInput = screen.getByLabelText("Telefone:")
    const emailInput = screen.getByLabelText("Email:")
    const passwordInput = screen.getByLabelText("Senha:")
    const submitBtn = screen.getByText("Atualizar")

    fireEvent.change(nameInput, { target: { value: "Teste da Silva" } })
    fireEvent.change(addressInput, { target: { value: "Rua do Teste" } })
    fireEvent.change(phoneInput, { target: { value: "11 9748-6621" } })
    fireEvent.change(emailInput, { target: { value: "teste@gmail.com" } })
    fireEvent.change(passwordInput, { target: { value: "123" } })
    fireEvent.click(submitBtn)
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    
    const success = screen.queryByText("Dados da conta atualizados com sucesso!")
    expect(success).not.toBeNull()
  })
})
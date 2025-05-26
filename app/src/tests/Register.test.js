import React from "react";
import { act, fireEvent, queryByText, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import Register from "../pages/Register";

// Mock dependencies
jest.mock("../styles/Register.module.css", () => ({}))

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
      <MemoryRouter initialEntries={[{ pathname: "/register" }]}>
        <Routes>
          <Route path="/register" element={<Register/>} />
        </Routes>
      </MemoryRouter>
    )
}

describe("Register page", () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it("renders without crashing", async () => {
    renderPage()
    const title = await screen.findByText("Cadastro")
    expect(title).toBeInTheDocument()
  })

  it("prevents registering with invalid email and phone", async () => {
    renderPage()

    const nameInput = screen.getByPlaceholderText("Nome:")
    const addressInput = screen.getByPlaceholderText("Endereço:")
    const phoneInput = screen.getByPlaceholderText("Telefone:")
    const emailInput = screen.getByPlaceholderText("Email:")
    const passwordInput = screen.getByPlaceholderText("Senha:")
    const submitBtn = screen.getByText("Cadastrar")

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
    renderPage()

    const nameInput = screen.getByPlaceholderText("Nome:")
    const addressInput = screen.getByPlaceholderText("Endereço:")
    const phoneInput = screen.getByPlaceholderText("Telefone:")
    const emailInput = screen.getByPlaceholderText("Email:")
    const passwordInput = screen.getByPlaceholderText("Senha:")
    const submitBtn = screen.getByText("Cadastrar")

    fireEvent.change(nameInput, { target: { value: "Teste da Silva" } })
    fireEvent.change(addressInput, { target: { value: "Rua do Teste" } })
    fireEvent.change(phoneInput, { target: { value: "11 9748-6621" } })
    fireEvent.change(emailInput, { target: { value: "teste@gmail.com" } })
    fireEvent.change(passwordInput, { target: { value: "123" } })
    fireEvent.click(submitBtn)
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    
    const error1 = screen.queryByText("Email inválido")
    const error2 = screen.queryByText("Telefone inválido")
    const error3 = screen.queryByText("Email inválido e Telefone inválido")
    expect(error1).toBeNull()
    expect(error2).toBeNull()
    expect(error3).toBeNull()
  })
})
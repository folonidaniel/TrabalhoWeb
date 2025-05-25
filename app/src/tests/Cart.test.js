import React from "react";
import { act, fireEvent, queryByText, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import Cart from "../pages/Cart";

// Mock dependencies
jest.mock("../components/Navbar", () => () => <div>Navbar</div>)
jest.mock("../components/Footer", () => () => <div>Footer</div>)
jest.mock("../components/Loading", () => () => <div>Loading...</div>)
jest.mock("../styles/Search.module.css", () => ({}))

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

function renderPage() {
    return render(
        <MemoryRouter initialEntries={[{ pathname: "/cart", state: null }]}>
            <Routes>
                <Route path="/cart" element={<Cart />} />
            </Routes>
        </MemoryRouter>
    )
}

describe("Cart page", () => {
    it("renders without crashing", async () => {
        sessionStorage.setItem("cart", JSON.stringify([
            {
                "id": 1,
                "title": "Celeste",
                "description": "Ajude Madeline a enfrentar seus demônios internos em sua jornada até o topo da Montanha Celeste, nesse jogo de plataforma super afiado dos criadores de TowerFall. Desbrave centenas de desafios meticulosos, descubra segredos complicados e desvende o mistério da montanha.",
                "images": ["/game-imgs/celeste.jpg"],
                "categories": ["Plataforma", "Aventura"],
                "price": 60.00,
                "quantityInStock": 7,
                "quantity": 3
            },
            {
                "id": 2,
                "title": "Dead Cells",
                "description": "Dead Cells é um 'roguelike' de ação em plataforma estilo Metroidvania. Você vai explorar um castelo extenso e em constante mutação... Sem checkpoints. Mate, morra, aprenda, repita.",
                "images": ["/game-imgs/dead-cells.png"],
                "categories": ["Roguelike", "Plataforma", "Ação"],
                "price": 47.00,
                "quantityInStock": 5
            }
        ]))
        renderPage()
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        const title1 = screen.getByText("Celeste")
        const title2 = screen.getByText("Dead Cells")
        expect(title1).toBeInTheDocument()
        expect(title2).toBeInTheDocument()
    })

    it("detects empty cart", async () => {
        sessionStorage.setItem("cart", JSON.stringify([]))
        renderPage()
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        const message = screen.getByText("O carrinho está vazio")
        expect(message).toBeInTheDocument()
    })

    it("updates product's quantity and recalculate the total price", async () => {
        sessionStorage.setItem("cart", JSON.stringify([
            {
                "id": 1,
                "title": "Celeste",
                "description": "Ajude Madeline a enfrentar seus demônios internos em sua jornada até o topo da Montanha Celeste, nesse jogo de plataforma super afiado dos criadores de TowerFall. Desbrave centenas de desafios meticulosos, descubra segredos complicados e desvende o mistério da montanha.",
                "images": ["/game-imgs/celeste.jpg"],
                "categories": ["Plataforma", "Aventura"],
                "price": 60.00,
                "quantityInStock": 7,
                "quantity": 3
            },
            {
                "id": 2,
                "title": "Dead Cells",
                "description": "Dead Cells é um 'roguelike' de ação em plataforma estilo Metroidvania. Você vai explorar um castelo extenso e em constante mutação... Sem checkpoints. Mate, morra, aprenda, repita.",
                "images": ["/game-imgs/dead-cells.png"],
                "categories": ["Roguelike", "Plataforma", "Ação"],
                "price": 47.00,
                "quantity": 5,
                "quantityInStock": 5
            }
        ]))
        renderPage()
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        const increaseQntBtn = screen.getAllByRole("button")[1]
        fireEvent.click(increaseQntBtn)
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });
        
        const quantityElem = screen.getAllByTestId("quantity")[0]
        expect(quantityElem.textContent).toEqual("4")
        
        const totalPriceElem = screen.getAllByTestId("totalPrice")[0]
        expect(totalPriceElem.textContent).toEqual("Total: 475.00 R$")
    })
    
    it("removes a product by decreasing its quantity", async () => {
        sessionStorage.setItem("cart", JSON.stringify([
            {
                "id": 1,
                "title": "Celeste",
                "description": "Ajude Madeline a enfrentar seus demônios internos em sua jornada até o topo da Montanha Celeste, nesse jogo de plataforma super afiado dos criadores de TowerFall. Desbrave centenas de desafios meticulosos, descubra segredos complicados e desvende o mistério da montanha.",
                "images": ["/game-imgs/celeste.jpg"],
                "categories": ["Plataforma", "Aventura"],
                "price": 60.00,
                "quantityInStock": 7,
                "quantity": 1
            },
            {
                "id": 2,
                "title": "Dead Cells",
                "description": "Dead Cells é um 'roguelike' de ação em plataforma estilo Metroidvania. Você vai explorar um castelo extenso e em constante mutação... Sem checkpoints. Mate, morra, aprenda, repita.",
                "images": ["/game-imgs/dead-cells.png"],
                "categories": ["Roguelike", "Plataforma", "Ação"],
                "price": 47.00,
                "quantity": 5,
                "quantityInStock": 5
            }
        ]))
        renderPage()
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        const removeBtn = screen.getByTestId("remove")
        fireEvent.click(removeBtn)
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });
        
        const removedTitle = screen.queryByText("Celeste")
        expect(removedTitle).not.toBeInTheDocument()
    })
})
import React from "react";
import { act, fireEvent, queryByText, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import Checkout from "../pages/Checkout";

// Mock dependencies
jest.mock("../components/Loading", () => () => <div>Loading...</div>)
jest.mock("../styles/Checkout.module.css", () => ({}))

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
        <MemoryRouter initialEntries={[{ pathname: "/checkout", state: null }]}>
            <Routes>
                <Route path="/checkout" element={<Checkout/>}/>
            </Routes>
        </MemoryRouter>
    )
}

describe("Checkout page", () => {
    it("renders without crashing", async () => {
        sessionStorage.setItem("loggedUser", JSON.stringify({id: 1, email: "teste@gmail.com", password: "123"}))
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

        const title = screen.getByText("Celeste")
        expect(title).toBeInTheDocument()
    })

    it("prevents continuing with empty data", async () => {
        sessionStorage.setItem("loggedUser", JSON.stringify({id: 1, email: "teste@gmail.com", password: "123"}))
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

        let nextStep = screen.getByText("Pagamento")
        fireEvent.click(nextStep)
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });
        
        nextStep = screen.queryByText("Confirmar")
        expect(nextStep).not.toBeInTheDocument()
    })

    it("prevents continuing with invalid card number", async () => {
        sessionStorage.setItem("loggedUser", JSON.stringify({id: 1, email: "teste@gmail.com", password: "123"}))
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

        let nextStep = screen.getByText("Pagamento")
        fireEvent.click(nextStep)
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });
        
        const nameInput = screen.getByLabelText("Nome no Cartão") 
        const cardNumberInput = screen.getByLabelText("Número do Cartão") 
        const expDateInput = screen.getByLabelText("Data de Expiração") 
        const cvvInput = screen.getByLabelText("CVV") 
        nextStep = screen.getByText("Revisar Compra")

        fireEvent.change(nameInput, { target: { value: "Teste da Silva" } })
        fireEvent.change(cardNumberInput, { target: { value: "123" } })
        fireEvent.change(expDateInput, { target: { value: "04/2028" } })
        fireEvent.change(cvvInput, { target: { value: "444" } })
        fireEvent.click(nextStep)
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        nextStep = screen.queryByText("Confirmar")
        expect(nextStep).not.toBeInTheDocument()
    })

    it("prevents continuing with invalid expiration date", async () => {
        sessionStorage.setItem("loggedUser", JSON.stringify({id: 1, email: "teste@gmail.com", password: "123"}))
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

        let nextStep = screen.getByText("Pagamento")
        fireEvent.click(nextStep)
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });
        
        const nameInput = screen.getByLabelText("Nome no Cartão") 
        const cardNumberInput = screen.getByLabelText("Número do Cartão") 
        const expDateInput = screen.getByLabelText("Data de Expiração") 
        const cvvInput = screen.getByLabelText("CVV") 
        nextStep = screen.getByText("Revisar Compra")

        fireEvent.change(nameInput, { target: { value: "Teste da Silva" } })
        fireEvent.change(cardNumberInput, { target: { value: "4444 4444 4444 4444" } })
        fireEvent.change(expDateInput, { target: { value: "123" } })
        fireEvent.change(cvvInput, { target: { value: "444" } })
        fireEvent.click(nextStep)
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        nextStep = screen.queryByText("Confirmar")
        expect(nextStep).not.toBeInTheDocument()
    })

    it("prevents continuing with invalid CVV", async () => {
        sessionStorage.setItem("loggedUser", JSON.stringify({id: 1, email: "teste@gmail.com", password: "123"}))
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
                "quantityInStock": 5,
                "quantity": 2
            }
        ]))
        renderPage()
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        let nextStep = screen.getByText("Pagamento")
        fireEvent.click(nextStep)
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });
        
        const nameInput = screen.getByLabelText("Nome no Cartão") 
        const cardNumberInput = screen.getByLabelText("Número do Cartão") 
        const expDateInput = screen.getByLabelText("Data de Expiração") 
        const cvvInput = screen.getByLabelText("CVV") 
        nextStep = screen.getByText("Revisar Compra")

        fireEvent.change(nameInput, { target: { value: "Teste da Silva" } })
        fireEvent.change(cardNumberInput, { target: { value: "4444 4444 4444 4444" } })
        fireEvent.change(expDateInput, { target: { value: "04/2028" } })
        fireEvent.change(cvvInput, { target: { value: "4" } })
        fireEvent.click(nextStep)
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        nextStep = screen.queryByText("Confirmar")
        expect(nextStep).not.toBeInTheDocument()
    })

    it("Temporarily saves valid card information", async () => {
        sessionStorage.setItem("loggedUser", JSON.stringify({id: 1, email: "teste@gmail.com", password: "123"}))
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

        let nextStep = screen.getByText("Pagamento")
        fireEvent.click(nextStep)
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });
        
        const nameInput = screen.getByLabelText("Nome no Cartão") 
        let cardNumberInput = screen.getByLabelText("Número do Cartão") 
        const expDateInput = screen.getByLabelText("Data de Expiração") 
        const cvvInput = screen.getByLabelText("CVV") 
        nextStep = screen.getByText("Revisar Compra")

        fireEvent.change(nameInput, { target: { value: "Teste da Silva" } })
        fireEvent.change(cardNumberInput, { target: { value: "4444 4444 4444 4444" } })
        fireEvent.change(expDateInput, { target: { value: "04/2028" } })
        fireEvent.change(cvvInput, { target: { value: "444" } })
        fireEvent.click(nextStep)
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        const previousStep = screen.getByText("Voltar")
        fireEvent.click(previousStep)
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        cardNumberInput = screen.getByLabelText("Número do Cartão") 
        expect(cardNumberInput.value).toEqual("4444 4444 4444 4444")
    })


    it("allows the purchase to be completed with valid data", async () => {
        sessionStorage.setItem("loggedUser", JSON.stringify({id: 1, email: "teste@gmail.com", password: "123"}))
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

        let nextStep = screen.getByText("Pagamento")
        fireEvent.click(nextStep)
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });
        
        const nameInput = screen.getByLabelText("Nome no Cartão") 
        const cardNumberInput = screen.getByLabelText("Número do Cartão") 
        const expDateInput = screen.getByLabelText("Data de Expiração") 
        const cvvInput = screen.getByLabelText("CVV") 
        nextStep = screen.getByText("Revisar Compra")

        fireEvent.change(nameInput, { target: { value: "Teste da Silva" } })
        fireEvent.change(cardNumberInput, { target: { value: "4444 4444 4444 4444" } })
        fireEvent.change(expDateInput, { target: { value: "04/2028" } })
        fireEvent.change(cvvInput, { target: { value: "444" } })
        fireEvent.click(nextStep)
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        nextStep = screen.getByText("Confimar")
        fireEvent.click(nextStep)
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });
        
        const successMessage = screen.queryByText("Compra concluída com sucesso!") 
        expect(successMessage).toBeInTheDocument()
    })
})
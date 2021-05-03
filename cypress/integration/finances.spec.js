/// <reference types="cypress" />

import { format, prepareLocalStorage } from '../support/utils'

context('dev finances Agilizei', () => {

    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app', {
            onBeforeLoad: (win) => {
                prepareLocalStorage(win)
            }
        });
    });

    it('Cadastrar entradas', () => {

        cy.get('#transaction .button').click();
        cy.get('#description').type('Mesada');
        cy.get('[name=amount]').type(15.99);
        cy.get('[type=date]').type('1999-01-09');
        cy.get('button').contains('Salvar').click();

        cy.get('#data-table tbody tr').should('have.length', 3);

    });

    it('Cadastrar saidas', () => {

        cy.get('#transaction .button').click();
        cy.get('#description').type('Mesada');
        cy.get('[name=amount]').type(-20.09);
        cy.get('[type=date]').type('1999-01-09');
        cy.get('button').contains('Salvar').click();

        cy.get('#data-table tbody tr').should('have.length', 3);

    });

    it('Remover entradas e saidas', () => {
        const entrada = 'Mesada'
        const saida = 'chocolate'

        cy.get('#transaction .button').click();
        cy.get('#description').type(entrada);
        cy.get('[name=amount]').type(-20.09);
        cy.get('[type=date]').type('1999-01-09');
        cy.get('button').contains('Salvar').click();

        cy.get('#transaction .button').click();
        cy.get('#description').type(saida);
        cy.get('[name=amount]').type(-20.09);
        cy.get('[type=date]').type('1999-01-09');
        cy.get('button').contains('Salvar').click();

        //estrategia pegando pelo pai
        cy.get('td.description')
            .contains(entrada)
            .parent()
            .find('img[onclick*=remove]')
            .click()

             //estrategia pegando pelos irmaos
        cy.get('td.description')
            .contains(saida)
            .siblings()
            .children('img[onclick*=remove]')
            .click()

        cy.get('#data-table tbody tr').should('have.length', 2);
    });

    it('Validar saldo com diversas transacoes', () => {

        let incomes = 0
        let expenses = 0

        cy.get('#data-table tbody tr')
            .each(($el, index, $list) => {
                cy.get($el).find('td.income, td.expense').invoke('text').then(text => {
                    if(text.includes('-')){
                        expenses = expenses + format(text)
                    } else {
                        incomes = incomes + format(text)
                    }
                    cy.log(incomes)
                    cy.log(expenses)
                })
            })

        cy.get('#totalDisplay').invoke('text').then(text => {
            let formattedTotaldisplay = format(text)
            let expectedTotal = incomes + expenses

            expect(formattedTotaldisplay).to.eq(expectedTotal)
        })
            
    });
});
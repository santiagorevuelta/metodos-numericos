"use client"
import React, {useEffect, useState} from 'react';
import {Col, Form, Row, Table} from "react-bootstrap";
import { toast } from 'react-toastify';
import * as math from 'mathjs'
import {MathJax, MathJaxContext} from "better-react-mathjax";


function PolinomioTaylor() {
    const [pasos, setPasos] = useState([{
        x: 0,
        termino: ``,
        polinomio: 1,
        valorAproximado: '',
        errorAbsoluto: 1,
        errorPorcentual: 1,
        isT: false,
    }]);
    const [funcion, setFuncion] = useState('exp(x)');
    const [punto, setPunto] = useState(0);
    const [error, setError] = useState('0');
    const [formula, setFormula] = useState('');


    const calcularTaylor = () => {
        // @ts-ignore
        if (funcion === '' ||  error === 0 || error === '0') {
            return toast.warning('Algunos valores no pueden estar en cero!');
        }
        const _paso = [{
            x: 0,
            termino: `\\(\\frac{(e^x - ${punto})}{1}* 1 = e\\)`,
            polinomio: 1,
            valorAproximado: '',
            errorAbsoluto: 1,
            errorPorcentual: 1,
            isT: false,
        }]
        let i = 1
        let encontrado = false
        let Acum = 0
        let EA =  0
        while (!encontrado){
            Acum = 0
            EA =  0
            if(i == 1){
                EA = Math.exp(punto)-i
                Acum = i
            }else{
                let sum = parseFloat(String(punto))
                if(i > 2) sum = sum-parseFloat(String(punto))
                sum += _paso[_paso.length-1].polinomio+(Math.pow(punto, i)/math.factorial(i))
                Acum = sum
                EA = Math.exp(punto)-sum;
            }

            if(EA < parseFloat(String(error))){
                encontrado = !encontrado
            }
            _paso.push({
                x: i,
                termino: `\\(\\frac{e^x (e)}{${i}!}* (x - ${punto})^${i} = \\frac{(e)}{${i}}(x - 1)^${i}\\)`,
                polinomio: Acum,
                valorAproximado: !encontrado?`EA > Tolerancia`:`EA < Tolerancia`,
                errorAbsoluto: EA,
                errorPorcentual: 0,
                isT: encontrado,
            })
            i++
        }
        _paso.push({
            x: i,
            termino: `\\(\\frac{e^x (e)}{${i}!}* (x - ${punto})^${i} = \\frac{(e)}{${i}}(x - 1)^${i}\\)`,
            polinomio: Acum,
            valorAproximado: !encontrado?`EA > Tolerancia`:`EA < Tolerancia`,
            errorAbsoluto: EA,
            errorPorcentual: 0,
            isT: false,
        })

        let _formula = calcularFormula(i)
        setFormula( _formula)
        // @ts-ignore
        setPasos(_paso);
        toast.success('Evaluado!');
    };
    function calcularFormula(n: number) {
        let  _formula = '1 + x ';
        for (let i = 1; i < n; i++) {
            if(i <= 4){
                _formula += `+\\frac{x^${i}}{${i}!}`
            }
        }
        if(n > 4){
            _formula += `+...+\\frac{x^n}{n!}`
        }
        _formula += `\\approx \\sum_{i=1}^n \\frac{x^i}{i!}`
        return `$$e^x \\approx ${_formula}$$`
    }

    return (
        <div>
            <Row>
                <Col>
                    <Form.Label htmlFor="f">Funcion</Form.Label>
                    <Form.Control
                        type="text"
                        id="f"
                        value={funcion}
                        onChange={(e) => setFuncion(e.target.value)}
                    />
                </Col>
                <Col>
                    <Form.Label htmlFor="p">Valor de x</Form.Label>
                    <Form.Control
                        type="number"
                        value={punto}
                        onChange={(e) => setPunto(parseFloat(e.target.value))}
                        id="p"
                    />
                </Col>
                <Col>
                    <Form.Label htmlFor="e">Error</Form.Label>
                    <Form.Control
                        type="number"
                        id="e"
                        value={error}
                        onChange={(e) => setError(e.target.value)}
                    />
                </Col>
            </Row>

            <Row className={'mt-4'}>
                <Col>
                    <button className={'btn btn-primary'} onClick={calcularTaylor}>Evaluar</button>
                </Col>
            </Row>
            <Row className={'mt-4'}>
                <MathJaxContext>
                    <MathJax>{formula}</MathJax>
                </MathJaxContext>
            </Row>

            <br/>
            <Table>
                <thead>
                <tr>
                    <th>Cantidad de terminos</th>
                    <th>Polinomio de Taylor</th>
                    <th>E Absoluto</th>
                    <th>Error</th>
                    <th>Formula</th>
                  {/*  <th>Error Porcentual</th>*/}
                </tr>
                </thead>
                <tbody>
                {pasos.length > 1 &&  pasos.map((paso, index) => (
                    <tr key={index} className={`${paso.isT?'isT':''}`}>
                        <td>{paso.x}</td>
                        <td>{paso.polinomio}</td>
                        <td>{paso.errorAbsoluto.toFixed(10)}</td>
                        <td>{paso.valorAproximado}</td>
                         <td>
                            <MathJaxContext>
                                <MathJax>{paso.termino}</MathJax>
                            </MathJaxContext>
                          </td>
                       {/* <td>{paso.errorPorcentual.toFixed(5)}%</td>*/}
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}

export default PolinomioTaylor;

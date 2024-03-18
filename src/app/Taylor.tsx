"use client"
import React, {useState} from 'react';
import {Col, Form, Row, Table} from "react-bootstrap";
import {toast} from 'react-toastify';
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
    const [punto, setPunto] = useState('0');
    const [error, setError] = useState('0');
    const [terminoFinal, setTerminoFinal] = useState('');
    const [formulaFinal, setFormulaFinal] = useState('');
    const config = {
        loader: { load: ["input/asciimath"] }
    };

    const calcularTaylor = () => {
        setPasos([]);
       try {
           // @ts-ignore
           if (funcion === '' || error === 0 || error === '0') {
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
           let EA = 0
           while (!encontrado) {
               Acum = 0
               EA = 0
               if (i == 1) {
                   EA = Math.exp(Number(punto)) - i
                   Acum = i
               } else {
                   let sum = parseFloat(String(punto))
                   if (i > 2) sum = sum - parseFloat(String(punto))
                   sum += _paso[_paso.length - 1].polinomio + (Math.pow(Number(punto), i) / math.factorial(i))
                   Acum = sum
                   EA = Math.exp(Number(punto)) - sum;
               }

               if (EA < parseFloat(String(error))) {
                   encontrado = !encontrado
                   setTerminoFinal(String(i))
               }
               _paso.push({
                   x: i,
                   termino: `\\(\\frac{e^x (${Math.exp(Number(punto))})}{${math.factorial(i)}}* (${punto} - x)^${i} = \\frac{(e)}{${i}}(${punto} - 1)^${i}\\)`,
                   polinomio: Acum,
                   valorAproximado: !encontrado ? `EA > Tolerancia` : `EA < Tolerancia`,
                   errorAbsoluto: EA,
                   errorPorcentual: Math.abs(EA)/ Math.exp(Number(punto)) * 100,
                   isT: encontrado,
               })
               i++
           }
           //Para calcular el ultimo termino
           Acum = _paso[_paso.length - 1].polinomio + (Math.pow(Number(punto), i) / math.factorial(i))
           EA = Math.exp(Number(punto)) - Acum;

           _paso.push({
               x: i,
               termino: `\\(\\frac{e^x (${Math.exp(Number(punto))})}{${math.factorial(i)}}* (${punto} - x)^${i} = \\frac{(e)}{${i}}(${punto} - 1)^${i}\\)`,
               polinomio: Acum,
               valorAproximado: !encontrado ? `EA > Tolerancia` : `EA < Tolerancia`,
               errorAbsoluto: EA,
               errorPorcentual: Math.abs(EA) / Math.exp(Number(punto)) * 100,
               isT: false,
           })
           calcularFormula(i)
           // @ts-ignore
           setPasos(_paso);
           toast.success('Evaluado!');
       }catch (e) {
           toast.warning('Ocurrió un error general');
       }
    };

    function calcularFormula(n: number) {
        setFormulaFinal('load')
       setTimeout(()=>{
           let _formula = `1 + ${Number(punto)} `;
           for (let i = 1; i < n; i++) {
               //if (i <= 4) {
               _formula += `+\\frac{${Math.pow(Number(punto), i)}}{${math.factorial(i)}}`
               // }
           }
           /*if (n > 4) {
               _formula += `+...+\\frac{x^n}{n!}`
           }*/
           //_formula += `\\approx \\sum_{i=1}^n \\frac{x^i}{i!}`
           setFormulaFinal(`$$e^x \\approx ${_formula}$$`)
       },1500)
    }

    return (
        <div>
            <Row className={'mt-1 justify-content-center'}>
                <MathJaxContext config={config}>
                    <span>Formula taylor</span>
                    <MathJax>{`$$e^x \\approx 1 + x +\\frac{x^1}{1!}+\\frac{x^2}{2!}+\\frac{x^3}{3!}+\\frac{x^4}{4!}+...+\\frac{x^n}{n!}\\approx \\sum_{i=1}^n \\frac{x^i}{i!}$$`}</MathJax>
                </MathJaxContext>
            </Row>
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
                        type="numeric"
                        value={punto}
                        onChange={(e) => setPunto(e.target.value.replaceAll(',','.'))}
                        id="p"
                    />
                </Col>
                <Col>
                    <Form.Label htmlFor="e">Error</Form.Label>
                    <Form.Control
                        type="numeric"
                        id="e"
                        value={error}
                        onChange={(e) => setError(e.target.value.replaceAll(',','.'))}
                    />
                </Col>
            </Row>
            <Row className={'mt-4'}>
                <Col sm={4} style={{display:'flex',justifyContent:'space-between'}}>
                    <button className={'btn btn-primary'} onClick={calcularTaylor}>Evaluar</button>
                    <button className={'btn btn-secondary'} onClick={()=>{
                        setPunto('0')
                        setError('0')
                        setPasos([])
                        setFormulaFinal('')
                        setTerminoFinal('')
                    }}>Limpiar</button>
                </Col>
                <Col>
                    {terminoFinal !== '' && (
                        <Form.Label htmlFor="p">La cantidad de terminos necesarios son: {terminoFinal}</Form.Label>
                    )}
                </Col>
            </Row>
            {formulaFinal !== '' && (formulaFinal == 'load'? (
                <div className="loader">
                    <div className="dot dot-1"></div>
                    <div className="dot dot-2"></div>
                    <div className="dot dot-3"></div>
                    <div className="dot dot-4"></div>
                    <div className="dot dot-5"></div>
                </div>
            ) : (
            <Row className={'mt-1 justify-content-center'} style={{maxWidth: '100vh'}}>
                <MathJaxContext config={config}>
                    <span>Formula con valores</span>
                    <MathJax className={'formula-math'}>{formulaFinal}</MathJax>
                </MathJaxContext>
            </Row>))}

            <br/>
            {pasos.length > 1 && (<Table>
                <thead>
                <tr>
                    <th>Cantidad de terminos</th>
                    <th>Polinomio de Taylor</th>
                    <th>Error Absoluto</th>
                    <th>Tolerancia</th>
                    <th>Error Porcentual</th>
                    {/*<th>Formula</th>*/}
                </tr>
                </thead>
                <tbody>
                {pasos.map((paso, index) => (
                    <tr key={index} className={`${paso.isT ? 'isT' : ''}`}>
                        <td>{paso.x}</td>
                        <td>{paso.polinomio.toFixed(10)}</td>
                        <td>{paso.errorAbsoluto.toFixed(10)}</td>
                        <td>{paso.valorAproximado}</td>
                         <td>{paso.errorPorcentual.toFixed(5)}%</td>
                       {/* <td>
                            <MathJaxContext>
                                <MathJax>{paso.termino}</MathJax>
                            </MathJaxContext>
                        </td>*/}
                    </tr>
                ))}
                </tbody>
            </Table>)}
        </div>
    );
}

export default PolinomioTaylor;

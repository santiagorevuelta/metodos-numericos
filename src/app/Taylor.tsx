"use client"
import React, {useState} from 'react';
import {Col, Form, InputGroup, Row, Table} from "react-bootstrap";
import {toast} from 'react-toastify';
import * as math from 'mathjs'
import {MathJax, MathJaxContext} from "better-react-mathjax";
import data from '@/app/data'
import {Button} from "@restart/ui";

let initial = {
    x: 0,
    valor_teorico: 0,
    valor_experimental: 0,
    polinomio: 0,
    tolerancia: "",
    errorPorcentual: 1,
    isT: false,
}

function PolinomioTaylor() {
    const [pasos, setPasos] = useState([initial]);
    const [funcion, setFuncion] = useState('');
    const [punto, setPunto] = useState('1');
    const [error, setError] = useState('0.0001');
    const [terminoFinal, setTerminoFinal] = useState('');
    const [formulaFinal, setFormulaFinal] = useState('');
    const [verLista, setVerLista] = useState(false);
    const config = {
        loader: {load: ["input/asciimath"]}
    };

    const calcularTaylor = () => {
        setPasos([]);
        try {
            // @ts-ignore
            if (funcion === '' || error === '' || error === '0' || punto === '') {
                setFormulaFinal('')
                setTerminoFinal('')
                return toast.warning('Algunos valores no pueden estar en cero!');
            }

            let valor_x = parseFloat(String(punto))
            try {
                math.evaluate(funcion, {x: valor_x});
            } catch (error) {
                // @ts-ignore
                return toast.error("Error al evaluar la expresión: " + error.message);
            }
            let fn_eval = math.evaluate(funcion, {x: punto})
            const _paso = [{
                x: 0,
                valor_teorico: valor_x,
                valor_experimental: (fn_eval-1),
                polinomio: 1,
                tolerancia: "",
                errorPorcentual: 0,
                isT: false,
            },{
                x: 1,
                valor_teorico: 1 + valor_x,
                valor_experimental: fn_eval - 2,
                polinomio: 1+valor_x,
                tolerancia: "",
                errorPorcentual: Math.abs(1+valor_x) / Math.abs(fn_eval) * 100,
                isT: false,
            }]
            let i = 1
            let encontrado = false
            let Acum = 0
            let EA = 0 //Valor experimental
            let n_factorial = 2;
            while (!encontrado) {
                //let sum = valor_x
                //if (i >= 2) sum = sum - valor_x
                let res = Math.pow(valor_x, i)
                let n_fac = math.factorial(n_factorial)
                let sum = _paso[i].polinomio + (res/n_fac)
                Acum = sum
                EA = fn_eval - sum

                if (EA < parseFloat(String(error))) {
                    encontrado = !encontrado
                    setTerminoFinal(String(i + 1))
                }
                _paso.push({
                    x: i + 1,
                    valor_teorico: Acum,
                    valor_experimental: EA,
                    polinomio: Acum,
                    tolerancia: !encontrado ? `EA > T` : `EA < T`,
                    errorPorcentual: Math.abs(EA) / Math.abs(fn_eval) * 100,
                    isT: encontrado,
                })
                i++
                n_factorial++
                if (i >= 1000) {
                    setTerminoFinal('')
                    toast.warning(`Fuera de rango, el limite supera las ${i} iteraciones`);
                    break
                }
            }
            let res = Math.pow(valor_x, i)
            let n_fac= math.factorial(n_factorial)
            Acum = _paso[i].polinomio + (res/n_fac)
            EA = fn_eval - Acum;

            _paso.push({
                x: i + 1,
                valor_teorico: Acum,
                valor_experimental: EA,
                polinomio: Acum,
                tolerancia: !encontrado ? `EA > T` : `EA < T`,
                errorPorcentual: Math.abs(EA) / Math.abs(fn_eval) * 100,
                isT: false,
            })
            calcularFormula(i>=50?50:i)
            // @ts-ignore
            setPasos(_paso.splice(0,50));
            toast.success('Evaluado!');
        } catch (e) {
            // @ts-ignore
            toast.warning(`Ocurrió un error general ${e.message}`);
        }
    };

    function calcularFormula(n: number) {
        setFormulaFinal('load')
        setTimeout(() => {
            let _formula = `1 + ${Number(punto)} `;
            for (let i = 1; i < n; i++) {
                _formula += `+\\frac{${Math.pow(Number(punto), i)}}{${math.factorial(i)}}`
            }
            setFormulaFinal(`$$${funcion} \\approx ${_formula}$$`)
        }, 1500)
    }

    return (
        <div>
            <Form>
                <Row className={'mt-1'}>
                    <Col>
                        <Form.Label htmlFor="f">{verLista ? 'Seleccione la función' : 'Escriba la función'}</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder={'Ejemplo: e^x'}
                                value={funcion}
                                onChange={(e) => setFuncion(e.target.value)}
                                id="f"
                            />
                            <Button className={'btn btn-dark'} id="bti" onClick={() => {
                                setPasos([])
                                setFormulaFinal('')
                                setTerminoFinal('')
                            }}>
                                Limpiar
                            </Button>
                            <Button className={'btn btn-primary'} id="bti" onClick={() => calcularTaylor()}>
                                Evaluar
                            </Button>
                        </InputGroup>
                        {/*<InputGroup>
                        {verLista ? (<Form.Select aria-label="Default select example"
                                     value={funcion}
                                     onChange={(e) => setFuncion(e.target.value)}>
                            {data.map(item=>(<option value={item.value}>{item.value}</option>))}
                        </Form.Select>):(
                            <Form.Control
                                type="text"
                                value={funcion}
                                onChange={(e) => setFuncion(e.target.value)}
                                id="f"
                            />
                        )}
                        <Button className={'btn btn-dark'} id="bti" onClick={()=>{
                            setFuncion('exp')
                            setVerLista(!verLista)
                        }}>
                            {verLista?'Ocultar':'Ver lista'}
                        </Button>
                    </InputGroup>*/}
                    </Col>
                </Row>
                <Row className={'mt-1'}>
                    <Col>
                        <Form.Label htmlFor="p">Ejemplos</Form.Label>
                        <Form.Select aria-label="Default select example"
                                     onChange={(e) => setFuncion(`${funcion}${e.target.value}`)}>
                            <option value={''}>Lista</option>
                            {data.map(item => (<option key={item.value} value={item.value}>{item.value}</option>))}
                        </Form.Select>
                    </Col>
                    <Col>
                        <Form.Label htmlFor="p">Valor de x</Form.Label>
                        <Form.Control
                            type="numeric"
                            value={punto}
                            onChange={(e) => setPunto(e.target.value.replaceAll(',', '.'))}

                            id="p"
                        />
                    </Col>
                    <Col>
                        <Form.Label htmlFor="e">Error</Form.Label>
                        <Form.Control
                            type="numeric"
                            id="e"
                            value={error}
                            onChange={(e) => setError(e.target.value.replaceAll(',', '.'))}
                        />
                    </Col>
                </Row>
                <Row className={'mt-2 justify-content-center'}>
                    <Col>
                        {terminoFinal !== '' && (
                            <Form.Label htmlFor="p">La cantidad de terminos necesarios son: {terminoFinal}</Form.Label>
                        )}
                    </Col>
                </Row>
                {formulaFinal !== '' && (formulaFinal == 'load' ? (
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
            </Form>
            <br/>
            {pasos.length > 1 && (<Table>
                <thead>
                <tr>
                    <th># Termino</th>
                    <th>Resultado</th>
                    <th>Valor experimental</th>
                    <th>Error</th>
                    <th>Tolerancia</th>
                </tr>
                </thead>
                <tbody>
                {pasos.map((paso, index) => (
                    <tr key={index} className={`${paso.isT ? 'isT' : ''}`}>
                        <td>{paso.x}</td>
                        <td>{paso.valor_teorico}</td>
                        <td>{paso.x === 0 ? paso.valor_experimental : paso.valor_experimental.toFixed(15)}</td>
                        <td>{`${paso.errorPorcentual.toFixed(10)}%`}</td>
                        <td>{paso.tolerancia}</td>
                    </tr>
                ))}
                </tbody>
            </Table>)}
        </div>
    );
}

export default PolinomioTaylor;

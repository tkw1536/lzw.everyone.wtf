import * as React from 'react';
import Head from 'next/head';
import style from './index.module.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { lzw_encode, lzw_decode, lzw_compile } from "../utils/compress";

interface IPageState {
    inputValue: string,
    outputValue: string,
    message: string,
}

export default class extends React.Component<{}, IPageState> {
    state: IPageState = { inputValue: "", outputValue: "", message: "" }

    private readonly onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ inputValue: event.target.value });
    }
    private readonly onClickCompress = () => {
        try {
            const inputValue = this.state.inputValue;
            const outputValue = lzw_encode(inputValue);
    
            const ratio = (outputValue.length / inputValue.length) * 100;
            const message = `Compressed ${inputValue.length} => ${outputValue.length} (${ratio}%)`;

            this.setState({ outputValue, message })
        } catch(e) {
            this.setState({ outputValue: "", message: "Failed to compress, is the input utf-8 and not utf-16? " + e })
        }
    }
    private readonly onClickDecompress = () => {
        try {
            const inputValue = this.state.inputValue;

            const outputValue = lzw_decode(inputValue);
            const message = `Decompressed ${inputValue.length} => ${outputValue.length}`;
        
            this.setState({ outputValue, message });
        } catch(e) {
            this.setState({ outputValue: "", message: "Failed to decompress: " + e })
        }
    }
    private readonly onClickCheck = () => {
        try {
            const inputValue = this.state.inputValue;
            const outputValue = lzw_encode(inputValue);
            const ratio = (outputValue.length / inputValue.length) * 100;

            const ok = lzw_decode(outputValue) == inputValue;

            const text = `${ok?"Success":"Failure"}
Compressed size ${inputValue.length} to size ${outputValue.length} (${ratio}%)`;

            this.setState({ outputValue: text, message: "" })
        } catch(e) {
            this.setState({ outputValue: "Failure\nIs the input utf-8 and not utf-16?\n"+e, message: "" })
        }
    }
    private readonly onClickCompile = () => {
        try {
            const inputValue = this.state.inputValue;
            const outputValue = lzw_compile(inputValue);

            const ratio = (outputValue.length / JSON.stringify(inputValue).length) * 100;
            const message = `Compiled ${inputValue.length} => ${outputValue.length} (${ratio}%)`;

            this.setState({ outputValue, message })
        } catch(e) {
            this.setState({ outputValue: "", message: "Failed to compile, is the input utf-8 and not utf-16? " + e })
        }
    }
    private readonly onClickEval = () => {
        try {
            const inputValue = this.state.inputValue;
            const outputValue = lzw_compile(inputValue);

            const ratio = (outputValue.length / JSON.stringify(inputValue).length) * 100;
            const message = `Compiled ${inputValue.length} => ${outputValue.length} (${ratio}%)`;

            const ok = eval("(" +outputValue + ")") == inputValue;
            const text = `${ok?"Success":"Failure"}
Compiled size ${inputValue.length} to size ${outputValue.length} (${ratio}%)`;

            this.setState({ outputValue: text, message: "" });
        } catch(e) {
            this.setState({ outputValue: "Failure\nIs the input utf-8 and not utf-16? " + e, message: "" })
        }
    }

    render() {
        const { inputValue, outputValue, message } = this.state;
        return <>
            <Head><title>JS LZW Compression</title></Head>
            <p>
                This page compresses UTF-8 Strings using LZW for inclusion in JavaScript Source Code. 
            </p>
            <p>
                <textarea className={style.InputBox} value={inputValue} onChange={this.onChange}></textarea>
            </p>
            <p>
                <button onClick={this.onClickCompress}>Compress</button>
                &nbsp;
                <button onClick={this.onClickDecompress}>Decompress</button>
                &nbsp;
                <button onClick={this.onClickCheck}>Check</button>
                &nbsp;
                &nbsp;
                <button onClick={this.onClickCompile}>Compile</button>
                &nbsp;
                <button onClick={this.onClickEval}>Eval</button>
                &nbsp;
                &nbsp;

                { message ? (
                    <CopyToClipboard text={outputValue} >
                        <button>Copy To Clipboard</button>
                    </CopyToClipboard>
                ) : <button disabled>Copy To Clipboard</button>}
                
                &nbsp;
                {message}
            </p>
            <p>
                <textarea className={style.OutputBox} readOnly value={outputValue}></textarea>
            </p>
            <p>
                <ul>
                    <li><b>Compress</b> text using lzw</li>
                    <li><b>Decompress</b> text using lzw</li>
                    <li><b>Check</b> that compression and decompression returns the original string</li>
                    <li><b>Compile</b> string for inclusion in JavaScript Code</li>
                    <li><b>Eval</b> that the compiled version returns the original JavaScript code</li>
                </ul>
            </p>
        </>;
    }
}
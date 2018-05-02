import * as React from 'react';
import { Component } from 'react';
import './PaginatedTable.scss';
import PageButton from './PageButton';

const maxButtons = 2;

export class PaginatedTable extends Component<{ columns: any, data: any, currentPage: number, total: number, pageSize: number, mapData: Function, onPageClick: Function, onRowClick: Function }> {

    currentPage;

    constructor(props) {
        super(props);
        this.currentPage = this.props.currentPage;
        this.onChangePage = this.onChangePage.bind(this);
    }

    renderPageButtons() {
        const buttons = [];
        const totalButtons = Math.ceil(this.props.total / this.props.pageSize);

        let start = this.currentPage - maxButtons;
        let end = 0;
        if (start <= 0) { // Move all extra buttons from left to right
            end += (-1 * start) + 1;
            start = 1;
        }
        end += this.currentPage + maxButtons;

        for (let i = start; i <= totalButtons && i <= end; i++) {
            buttons.push(
                <PageButton className={ this.currentPage === i ? 'current-page' : '' } key={i} text={ i } onClick={ this.onChangePage }/>
            );
        }
        return buttons;
    }

    renderData() {
        return this.props.data.map((data, rowIndex) => {
            return ( <tr key={rowIndex} onClick={ () => this.props.onRowClick(data) }>
                {
                    this.props.columns.map((col, colIndex) => {
                        return ( <td key={ colIndex }>{ this.props.mapData(colIndex, data) }</td> );
                    })
                }
            </tr> );
        });
    }

    renderColumns() {
        return this.props.columns.map((name, index) => {
            return ( <th scope="col" key={ index }>{ name }</th> )
        });
    }

    onChangePage(e) {
        const page = parseInt(e.target.textContent);
        this.currentPage = page;
        this.props.onPageClick(page);
    }

    render() {
        return (
            <div className="paginated-table">
                <table className="table table-striped">
                    <thead>
                    <tr>
                        { this.renderColumns() }
                    </tr>
                    </thead>
                    <tbody>
                    { this.props.data && this.renderData() }
                    </tbody>
                </table>
                <div className="table-page-buttons">
                    { this.renderPageButtons() }
                </div>
            </div>
        );
    }
}

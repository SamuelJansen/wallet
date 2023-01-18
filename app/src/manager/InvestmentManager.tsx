import { ContexState } from "../context-manager/ContextState";
import { StyleService } from "../service/StyleService";
import { InvestmentReportApi, InvestmentReturnsReportApi, InvestmentService } from "../service/InvestmentService";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    // BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
// import { Bar } from 'react-chartjs-2';
import { Line } from "react-chartjs-2";


export interface InvestmentManagerProps {
}


export class InvestmentManager extends ContexState<InvestmentManagerProps> implements InvestmentManagerProps {
    
    styleService: StyleService
    investmentService: InvestmentService
    
    constructor(props: {
        styleService: StyleService,
        investmentService: InvestmentService
    }) {
        super()
        this.styleService = props.styleService
        this.investmentService = props.investmentService
        this.state = {
            ...this.state
        } as InvestmentManagerProps
    }

    getInvestments = (): InvestmentReportApi[] => {
        return this.investmentService.getInvestmentReports()
    }

    buildNewChart = (investmentReturnApi: InvestmentReturnsReportApi) => {
        ChartJS.register(
            CategoryScale,
            LinearScale,
            PointElement,
            LineElement,
            Title,
            Tooltip,
            Legend,
            Filler
        );
        let cumulativeExpectedReturn = 0
        const expectedReturns: number[] = []
        investmentReturnApi.expected.forEach(investmentReturn => {
            expectedReturns.push(cumulativeExpectedReturn + investmentReturn.value)
            cumulativeExpectedReturn = cumulativeExpectedReturn + investmentReturn.value
        });
        let cumulativeExecutedReturn = 0
        const executedReturns: number[] = []
        investmentReturnApi.executed.forEach(investmentReturn => {
            executedReturns.push(cumulativeExecutedReturn + investmentReturn.value)
            cumulativeExecutedReturn = cumulativeExecutedReturn + investmentReturn.value
        });
        const data = {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
                {
                    label: "Expected returns",
                    data: expectedReturns,
                    fill: true,
                    backgroundColor: "rgba(75,192,192,0.2)",
                    borderColor: "rgba(75,192,192,0.5)"
                },
                {
                    label: "Executed returns",
                    data: executedReturns,
                    fill: false,
                    // backgroundColor: "rgba(75,192,192,0.2)",
                    borderColor: "#742774"
                }
            ]
        };
        return (
            <div key={investmentReturnApi.key} className="w-full h-full p-1 flex justify-center items-center">
                <Line 
                    data={data}
                    height='25%'
                    // width='1000%' //??? go figure...
                />
            </div>
        )
    }

    renderInvestments = () => {
        return this.investmentService.getCachedInvestmentReports().map((investmentReportApi: InvestmentReportApi) => {
            return (
                <div key={investmentReportApi.key} className={`w-100 h-[12rem] m-2 p-2 ${this.styleService.getTWCardRounded()} flex justify-between items-center ${this.styleService.getTWCardTextColor()}`}>
                    <div className={`w-[10rem] h-full p-2 ${this.styleService.getTWCardRounded()} overflow-clip flex flex-col justify-top items-right ${this.styleService.getTWCardColor()}`}>
                        <span className={`${this.styleService.getTWCardTextTitle()}`}>
                            {investmentReportApi.balance}
                        </span>
                        <span>
                            {investmentReportApi.label}
                        </span>
                        <span>
                            type: {investmentReportApi.type}
                        </span>
                        <span>
                            risk: {investmentReportApi.risk}
                        </span>
                        <span>
                            R$ {investmentReportApi.value}
                        </span>
                    </div>
                    <div
                        className={`w-full h-full px-2 ml-2 flex justify-left items-top ${this.styleService.getTWBackgroundColor()}`}
                    >
                        {/* <span className={`${this.styleService.getTWTextColor()}`}>
                            {investmentReportApi.key}
                        </span> */}
                        {this.buildNewChart(investmentReportApi.returns)}
                    </div>
                </div>
            )
        })
    }
}


export const InvestmentManagerProvider = (props: {
    styleService: StyleService,
    investmentService: InvestmentService
}) => new InvestmentManager(props)
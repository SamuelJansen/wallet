import { ContexState } from "../context-manager/ContextState";
import { StyleService } from "../service/StyleService";
import { BalanceService } from "../service/BalanceService";

export interface BalanceManagerStateProps {
}

export interface BalanceManagerProps {
    styleService: StyleService,
    balanceService: BalanceService
}


export class BalanceManager extends ContexState<BalanceManagerStateProps> implements BalanceManagerProps {
    
    styleService: StyleService
    balanceService: BalanceService
    
    constructor(props: BalanceManagerProps) {
        super()
        this.styleService = props.styleService
        this.balanceService = props.balanceService
        this.state = {
            ...this.state
        } as BalanceManagerStateProps
    }

    getBalances = () => {
        return this.balanceService.getBalances()
    }

    renderBalances = () => {
        return this.balanceService.getCachedBalances().map((balance: any) => {
            return (
                <div key={balance.key} className={`w-100 h-[12rem] m-2 p-2 ${this.styleService.getTWCardRounded()} flex justify-between items-center ${this.styleService.getTWCardTextColor()}`}>
                    <div className={`w-[10rem] h-full mr-2 p-2 ${this.styleService.getTWCardRounded()} flex flex-col justify-top items-right ${this.styleService.getTWCardColor()}`}>
                        <span className={`${this.styleService.getTWCardTextTitle()}`}>
                            {balance.key}
                        </span>
                        <span>
                            R$ {balance.value}
                        </span>
                    </div>
                    <div
                        className={`w-full h-full px-2 ml-2 flex justify-left items-top ${this.styleService.getTWBackgroundColor()}`}
                    >
                        <span className={`${this.styleService.getTWTextColor()}`}>
                            {balance.key}
                        </span>
                    </div>
                </div>
            )
        })
    }
}


export const BalanceManagerProvider = (props: BalanceManagerProps) => new BalanceManager(props)
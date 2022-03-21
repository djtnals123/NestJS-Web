import { IPaginationMeta } from "nestjs-typeorm-paginate";

export class CustomPaginationMeta {
    readonly itemCount: number;     // 현재 페이지 항목의 수
    readonly itemsPerPage: number;  // 페이지당 항목의 수
    readonly totalItems: number;    // 전체 항목의 수
    readonly currentPage: number;   // 현재 페이지
    readonly totalPages: number;    // 전체 페이지 수
    
    private readonly displayPageNum: number = 5;
    private readonly startPage: number;
    private readonly endPage: number;
    private readonly prevPage: number;
    private readonly nextPage: number;

    constructor(meta: IPaginationMeta, private keyword: string = undefined, private searchOption: string = undefined) {
        this.itemCount = meta.itemCount;
        this.itemsPerPage = meta.itemsPerPage;
        this.currentPage = meta.currentPage;
        this.totalItems = meta.totalItems;
        this.totalPages = meta.totalPages;
        
        this.endPage = Math.ceil(this.currentPage / this.displayPageNum) * this.displayPageNum;
        this.startPage = this.endPage - this.displayPageNum + 1;
        
        const tempEndPage = Math.ceil(this.totalItems / this.itemsPerPage);    
        if(this.endPage > tempEndPage) {
            this.endPage = tempEndPage;
        }
        this.prevPage = this.startPage == 1 ? undefined : this.startPage - 1;
        this.nextPage = this.endPage * this.itemsPerPage >= this.totalItems ? undefined : this.endPage + 1;
    }
  }
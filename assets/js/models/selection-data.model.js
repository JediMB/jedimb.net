export default class SelectionData {
    /**
     * 
     * @param {Selection} param0 
     */
    constructor({direction, isCollapsed, anchorNode, anchorOffset, focusNode, focusOffset}) {
        const isForward = direction !== 'backward';
        
        this.isCollapsed = isCollapsed;
        this.startNode = isForward ? anchorNode : focusNode;
        this.startOffset = isForward ? anchorOffset : focusOffset;
        this.endNode = isCollapsed ? this.startNode
            : isForward ? focusNode : anchorNode;
        this.endOffset = isCollapsed ? this.startOffset
            : isForward ? focusOffset : anchorOffset;
    }
}
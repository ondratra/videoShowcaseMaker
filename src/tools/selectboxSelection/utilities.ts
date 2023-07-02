export const selectboxSelection = {
    option: (optionIndex: number, firstOptionIsDescriptive = true) =>
        `.selectboxSelectionContainer div:nth-child(${optionIndex + 1 + (firstOptionIsDescriptive ? 1 : 0)})`,
}

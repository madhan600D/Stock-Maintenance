export const ActionEnum = Object.freeze(
    {
        ADD:"ADD",
        VIEW:"VIEW",
        ALTER:"ALTER"
    }
)

export const ControlEnum = Object.freeze(
    {
        INVENTORY:"INVENTORY",
        USER:"USER",
        SETTINGS:"SETTINGS"
    }
)

export const DaysEnum = Object.freeze({
    SUN:0,
    MON:1,
    TUE:2,
    WED:3,
    THU:5,
    FRI:6,
    SAT:7
})

export const SocketEventsEnum = Object.freeze({
    connection:"connection",
    ROOM_CONFIRMATION:"ROOM_CONFIRMATION",
    PRODUCT_EVENT:"PRODUCT_EVENT",
    ORDER_EVENT:"ORDER_EVENT",
    CHECKOUT_EVENT:"CHECKOUT_EVENT"
})

export const EventActionsEnum = Object.freeze({
    ADD:"ADD",
    ALTER:"ALTER",
    DELETE:"DELETE"
})

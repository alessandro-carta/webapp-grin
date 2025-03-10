import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
    page: {
        backgroundColor: "#fff",
        color: "#262626",
        fontFamily: "Helvetica",
        fontSize: "12px",
        padding: "30px 50px",
    },
    section: {
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: "Helvetica-Bold",
    },
    bold: {
        fontFamily: "Helvetica-Bold",
    },
    space: {
        marginTop: "11px",
    },
    content: {
        fontSize: 12,
    },
    titleSection: {
        fontSize: 14,
        textAlign: 'center',
        fontFamily: "Helvetica-Bold",
    },
    subtitleSection: {
        fontSize: 14,
        textAlign: 'left',
        fontFamily: "Helvetica-Bold",
    },
    elementList: {
        marginLeft: 10,
    },
    elementChildList: {
        marginLeft: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottom: '1px solid #E4E4E4',
    },
    tableCol1: {
        width: "60%",
        textAlign: "left",
        fontSize: "12px",
        paddingBottom: "10px",
        paddingTop: "10px",
        marginLeft: "11px",
    },
    tableCol2: {
        width: "40%",
        textAlign: "left",
        fontSize: "12px",
        borderLeft: 1,
        borderLeftColor: "#E4E4E4",
        borderBottomColor: "#E4E4E4",
        paddingBottom: "10px",
        paddingTop: "10px",
        marginLeft: "11px",
        paddingLeft: "11px",
    },
});
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
    
});
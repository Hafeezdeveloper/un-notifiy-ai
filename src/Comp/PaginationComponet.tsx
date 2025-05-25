import React from 'react';
import Pagination from "@mui/material/Pagination";
import PaginationItem from '@mui/material/PaginationItem';
import { createTheme, ThemeProvider } from "@mui/material/styles";

interface PaginationComponentProps {
    currentPage?: number;
    total?: number;
    setCurrentPage?: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
    currentPage = 1,
    total = 1,
    setCurrentPage = () => { }
}) => {
    const customTheme = createTheme({
        palette: {
            primary: {
                main: "#00443F",
            },
        },
    });

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            {total > 1 && (
                <div className="pagination-parent mt-6 pb-2">
                    <ThemeProvider theme={customTheme}>
                        <Pagination
                            count={total}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            hidePrevButton={currentPage === 1} // Hide the previous button when on the first page
                            hideNextButton={currentPage === total}
                            renderItem={(item) => {
                                // Disable the current page button
                                const isCurrentPage = item.page === currentPage;
                                return (
                                    <PaginationItem
                                        {...item}
                                        disabled={isCurrentPage} // Disable the current page button
                                    />
                                );
                            }}
                        />
                    </ThemeProvider>
                </div>
            )}
        </>
    );
};

export default PaginationComponent;

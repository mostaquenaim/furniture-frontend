'use client';
import useAxiosSecure from '@/hooks/Axios/useAxiosSecure';
import React, { useEffect } from 'react';

const ProductSyncPrice = () => {
    const axiosSecure = useAxiosSecure()
    useEffect(() => {
        const sync = async () => {
            try {
                const response = await axiosSecure.get('/product-sync-prices');
                console.log('Product prices synced successfully:', response.data);
            } catch (error) {
                console.error('Error syncing product prices:', error);
            }
        }

        sync()

    }, [axiosSecure]);
    return (
        <div>
            
        </div>
    );
};

export default ProductSyncPrice;
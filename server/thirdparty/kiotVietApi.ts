import { AxiosInstance } from 'axios';
import KiotHttp, { getTokenApi } from './kiotViet.http';

class KiotVietApi {
	categoryUrl = 'categories';

	productUrl = 'products';

	kiotHttp!: AxiosInstance;

	async authentication() {
		await getTokenApi();
		this.kiotHttp = KiotHttp();
	}

	async getAllCategory(pageSize = 20, currentItem = 0) {
		const res = await this.kiotHttp.get(this.categoryUrl, {
			params: {
				pageSize,
				currentItem
			}
		});
		return res.data;
	}

	async getAllProduct(pageSize = 20, currentItem = 0) {
		const res = await this.kiotHttp.get(this.productUrl, {
			params: {
				pageSize,
				currentItem,
				includeInventory: true,
				includePricebook: true,

			}
		});
		// console.dir(res.data, { depth: null });
		return res.data;
	}

	async countProduct() {
		const res = await this.kiotHttp.get(this.productUrl, {
			params: {
				includeInventory: true,
				includePricebook: true,
				pageSize: 1
			},
		});

		return res.data?.total || 0;
	}
}

// new KiotVietApi().countProduct();

export default new KiotVietApi();

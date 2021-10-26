import { ApiConnection } from "platform/connection.js";
import {
  ForwardingHistoryResponse,
  Invoice,
  Payment,
  SendResponse,
} from "../autogenerated-types";

type invoice = {
  rHash: Buffer;
  paymentRequest: string;
  rHashStr: string;
};

export class LNDLightning extends ApiConnection {
  constructor(baseUrl: string) {
    super(`${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}lightning`);
  }

  public set jwt(newJwt: string) {
    this._jwt = newJwt;
  }

  public async addInvoice(amt: string, memo = ""): Promise<Invoice> {
    return await this.post<Invoice>("/addInvoice", {
      memo,
      value: amt,
    });
  }

  public async forwardingHistory(
    startTime: number,
    endTime: number,
    indexOffset: number
  ): Promise<ForwardingHistoryResponse> {
    return await this.get<ForwardingHistoryResponse>(
      `/forwardingHistory?startTime=${startTime}&endTime=${endTime}&indexOffset=${indexOffset}`
    );
  }

  public async parsePaymentRequest(paymentRequest: string): Promise<invoice> {
    return await this.get<invoice>(
      `/invoice?paymentRequest=${paymentRequest}`
    );
  }

  public async invoices(): Promise<Invoice[]> {
    return await this.get<Invoice[]>("/invoices");
  }

  public async payInvoice(
    paymentRequest: string,
    amt?: number
  ): Promise<SendResponse> {
    return await this.post<SendResponse>("/payInvoice", {
      paymentRequest,
      amt,
    });
  }

  public async getPayments(): Promise<Payment[]> {
    return await this.get<Payment[]>("/payments");
  }
}

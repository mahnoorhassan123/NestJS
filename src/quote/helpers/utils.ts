import { Injectable, Logger } from '@nestjs/common';
import { SlackService } from 'src/common/services/slack.service';
import Taxjar = require('taxjar');
import request = require('request');
import { Request } from 'express';
import { CalculateUsTaxDto } from '../dtos/calculate-tax.dto';
@Injectable()
export class UtilsService {
  private readonly logger = new Logger(UtilsService.name);

  constructor(private readonly slackService: SlackService) {}

  async calculateTax(data: {
    ShipPostalCode: string;
    ShipCountry: string;
    ShipCity: string;
    ShipAddress: string;
  }): Promise<{
    code: number;
    status: boolean;
    msg: string;
    result?: any;
  }> {
    const response = {
      code: 200,
      status: true,
      msg: 'Nor EU neither US, AU or CA',
      result: {},
    };

    try {
      const taxjarClient = new Taxjar({
        apiKey: process.env.TAXJAR_API_KEY || '',
        apiUrl: process.env.TAXJAR_API_URL,
      });
      const resp: any = await taxjarClient.ratesForLocation(
        data.ShipPostalCode,
        {
          country: data.ShipCountry,
          city: data.ShipCity,
          street: data.ShipAddress,
        },
      );

      if (
        data.ShipCountry.toLowerCase() === 'us' ||
        data.ShipCountry.toLowerCase() === 'ca' ||
        data.ShipCountry.toLowerCase() === 'au'
      ) {
        resp.combined = true;
        resp.final_tax_rate = resp.rate.combined_rate;
        response.msg = 'US, AU or CA';
      } else {
        resp.combined = false;
        resp.final_tax_rate = resp.rate.standard_rate;
        response.msg = 'EU Region';
      }
      response.result = resp;
      return response;
    } catch (err) {
      console.error('something went wrong in the calculate tax', err);
      const errorMessage = JSON.stringify(err);
      await this.slackService.send(
        `File: tax.service.ts, \nAction: calculateTax, \nError: ${errorMessage}`,
        'J.A.R.V.I.S',
        'C029PF7DLKE',
      );

      return {
        code: 400,
        status: false,
        msg: err,
      };
    }
  }

  getProtocol(req: Request): string {
    return req.protocol + '://'; // e.g., 'http://'
  }

  getBaseUrl(req: Request): string {
    return req.get('host') ?? 'localhost:3000'; // e.g., 'localhost:3000'
  }

  async calculateUsTax(data: CalculateUsTaxDto) {
    const defaultResponse = {
      code: 200,
      status: false,
      msg: 'Failed to calculate tax rate',
      combined: false,
      final_tax_rate: 0,
      actualError: '',
    };

    try {
      // Input validation
      if (
        !data ||
        !data.ShipCountry ||
        data.ShipCountry === 'undefined' ||
        data.ShipCountry === null ||
        !data.ShipState ||
        data.ShipState === 'undefined' ||
        data.ShipState === null
      ) {
        const url =
          'http://services.gis.boe.ca.gov/api/taxrate/GetRateByAddress?Address=' +
          (data.ShipAddress || '') +
          '&City=' +
          (data.ShipCity || '') +
          '&Zip=' +
          [data.ShipPostalCode];

        const response: any = await new Promise((resolve, reject) => {
          request(url, (err, response, body) => {
            if (err) {
              reject(new Error(err.message || err));
            } else {
              resolve({ response, body });
            }
          });
        });

        const tax = JSON.parse(response.body);
        if (tax.taxRateInfo && !tax.errors) {
          return {
            code: 200,
            status: true,
            msg: 'US,AU or CA',
            combined: true,
            final_tax_rate: tax.taxRateInfo[0].rate,
            actualError: '',
          };
        } else {
          throw new Error(
            tax.errors
              ? tax.errors.map((error) => error.message).join('\n')
              : 'No tax rate info',
          );
        }
      }

      var country = data.ShipCountry.toLowerCase();
      if (
        (data.ShipState.toLowerCase() === 'ca' ||
          data.ShipState.toLowerCase() === 'california') &&
        country === 'us'
      ) {
        const url =
          'http://services.gis.boe.ca.gov/api/taxrate/GetRateByAddress?Address=' +
          (data.ShipAddress || '') +
          '&City=' +
          (data.ShipCity || '') +
          '&Zip=' +
          [data.ShipPostalCode];

        const response: any = await new Promise((resolve, reject) => {
          request(url, (err, response, body) => {
            if (err) {
              reject(new Error(err.message || err));
            } else {
              resolve({ response, body });
            }
          });
        });

        let tax = JSON.parse(response.body);
        if (tax.taxRateInfo && !tax.errors) {
          return {
            code: 200,
            status: true,
            msg: 'US,AU or CA',
            combined: true,
            final_tax_rate: tax.taxRateInfo[0].rate,
            actualError: '',
          };
        } else {
          throw new Error(
            tax.errors
              ? tax.errors.map((error) => error.message).join('\n')
              : 'No tax rate info',
          );
        }
      } else if (
        (data.ShipState.toLowerCase() === 'michigan' ||
          data.ShipState.toLowerCase() === 'mi') &&
        country === 'us'
      ) {
        return {
          combined: true,
          final_tax_rate: 6,
          msg: 'US,AU or MI',
          status: true,
          code: 200,
          actualError: '',
        };
      } else {
        return {
          combined: true,
          final_tax_rate: 0,
          msg: 'US,AU or ' + (data.ShipState || 'Unknown'),
          status: true,
          code: 200,
          actualError: '',
        };
      }
    } catch (error) {
      let errorMessage = 'Failed to calculate tax rate';
      let statusCode = 500;

      // Handle specific error types
      if (
        error.message.includes('No tax rate info') ||
        error.message.includes('A tax rate could not be found')
      ) {
        errorMessage = 'A tax rate could not be found at the given location';
        statusCode = 400;
      } else if (
        error.message.includes('Unexpected token') ||
        error.message.includes('JSON')
      ) {
        errorMessage = 'Failed to parse tax response';
        statusCode = 500;
      } else if (
        error.message.includes('Invalid input') ||
        error.message.includes('undefined')
      ) {
        errorMessage = 'Invalid input data for tax calculation';
        statusCode = 400;
      }

      // Log the full error for debugging
      const errorMsg = JSON.stringify(error.message || error);
      this.logger.error(`Error calculating US tax: ${errorMsg}`);
      await this.slackService.send(
        `File: utils.service.ts, Action: calculateUsTax, Error: ${errorMsg}`,
        'J.A.R.V.I.S',
        'C029PF7DLKE',
      );

      return {
        ...defaultResponse,
        code: statusCode,
        msg: errorMessage,
        actualError: errorMsg,
      };
    }
  }
}

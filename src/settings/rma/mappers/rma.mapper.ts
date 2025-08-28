import { EndUser, Rma } from '@prisma/client';
import { RmaResponseDto } from '../dtos/rma.dto';
export type PrismaRmaWithEndUser = Rma & {
  endUser: EndUser;
};

export class RmaMapper {
  static toDto(rmaWithUser: PrismaRmaWithEndUser): RmaResponseDto {
    const dto = new RmaResponseDto();
    const { rma, endUser } = { rma: rmaWithUser, endUser: rmaWithUser.endUser };

    dto.id = rma.id;
    dto.Taker = rma.receivedBy;
    dto.Name = `${endUser.firstName} ${endUser.lastName}`;
    dto.Company = endUser.company;
    dto.Address = [
      endUser.billingAddress1,
      endUser.billingAddress2,
      `${endUser.city}, ${endUser.state} ${endUser.postalCode}`,
      endUser.country,
    ]
      .filter(Boolean)
      .join('\r\n');

    dto.Email = endUser.email;
    dto.PhoneNumber = endUser.phoneNumber;
    dto.Device = rma.device;
    dto.SN = rma.sn;
    dto.RMANumber = rma.rmaNumber;
    dto.HavePO = rma.havePO ? '1' : '0';
    dto.HaveBoot = rma.haveBoot ? '1' : '0';
    dto.HaveCables = rma.haveCables ? '1' : '0';
    dto.HaveSimCard = rma.haveSimCard ? '1' : '0';
    dto.HaveSDCard = rma.haveSDCard ? '1' : '0';
    dto.HaveOther = rma.haveOther ? '1' : '0';
    dto.HaveSDcardSize = rma.haveSDcardSize ?? 'None';
    dto.HaveOtherText = rma.haveOtherText ?? '<Other>';
    dto.Vnet1 = rma.vnet1 ?? 'None';
    dto.Vnet2 = rma.vnet2 ?? 'None';
    dto.Vnet3 = rma.vnet3 ?? 'None';

    dto.RMAIssuedDate = rma.issuedDate.toLocaleString();
    dto.ReceivedDateTime = rma.receivedDateTime.toLocaleString();
    dto.FinishedDayTime =
      rma.finishedDayTime?.toLocaleString() ?? '<Date Time>';
    dto.PredefinedProblems = rma.predefinedProblems ?? '<Predefined Problems>';
    dto.Problem = rma.extraInfo ?? '';
    dto.ReceivedByName = rma.receivedBy ?? '<None>';
    dto.Notes = rma.notes ?? '';
    dto.RepairStatus = rma.repairStatus;
    dto.UnitInfo = rma.unitInfo ?? '';
    dto.ReplacedSN = rma.replacedSN ?? '';
    dto.RepairerName = rma.repairerName ?? '<None>';
    dto.TestedName = rma.testedName ?? '<None>';
    dto.ShippingTrackingNumber = rma.shippingTrackingNumber ?? '<None>';
    dto.BugZilla = rma.bugZilla ?? ' ';

    return dto;
  }
}

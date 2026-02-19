import { toast } from 'react-toastify';
import { centsToDollars } from '../utils/helpers';

export function showSuccess(msg: string): void {
  toast.success(msg);
}

export function showError(msg: string): void {
  toast.error(msg);
}

export function showInfo(msg: string): void {
  toast.info(msg);
}

export function showWarning(msg: string): void {
  toast.warning(msg);
}

export function showBid(username: string, amount: number, title: string): void {
  const formattedAmount = centsToDollars(amount);
  toast.success(
    username + ' placed a bid of ' + formattedAmount + ' on "' + title + '"',
    {
      autoClose: 4000,
    }
  );
}

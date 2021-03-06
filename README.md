# Обязательство Педерсена
Выполнение обязательств Педерсена в node.js .

Эти обязательства используются для фиксации значения сейчас, но не раскрывают фактическое значение позже (или никогда). Обязательства затем могут быть сложены вместе или вычтены друг из друга с использованием гомоморфного шифрования, не раскрывая значения, которым они были присвоены.

Например, допустим, Алиса хочет отправить Бобу несколько личных монет:

- Алиса уже взяла на себя обязательство сбалансировать используемую функцию:
 - Где H случайная точка на кривой выбранная для этой системы
 - ra коэффициент ослепления используемый для сокрытия транзакции

```
    Ca = perdersen.commitTo(H, ra, a);
```
- Боб также взял на себя обязательство соблюдать баланс в:

 ```
    Cb = perdersen.commitTo(H, rb, b);
 ```
 
- Алиса обязуется отправить Бобу t монет.  

 ```
    Ct = perdersen.commitTo(H, rt, t);
 ```
 
 - Чтобы сохранить общее количество монет в системе, баланс Алисы должен быть уменьшен на t, а баланс Боба должен увеличиться на t.
 - Это позволит любой третьей стороне, просматривающей систему, сделать вывод о том, что никакие монеты не были созданы или уничтожены. (однако это не относится к отрицательным числам, которые необходимо обрабатывать по-разному)
 - Теперь мы можем использовать свойства гомоморфного шифрования для добавления и вычитания эллиптической кривой из исходных зафиксированных остатков:

 ```
    var Caf = pedersen.subCommitments(Ca, Ct);
    var Cbf = pedersen.addCommitments(Cb, Ct);
 ```
 - Теперь, когда у нас есть окончательные балансы обеих сторон, мы можем проверить правильность их балансов, проверив их в частном порядке с помощью:
- Где ra, rb и rt - закрытые ключи ослепления
```
    pedersen.verifyCommitment(H, Caf, ra.sub(rt), a - t);
    pedersen.verifyCommitment(H, Cbf, rb.add(rt), b + t);
```
Балансы Алисы и Боба теперь полностью скрыты от посторонних глаз. Мы также убеждены, что никакие монеты не были добавлены или удалены из экосистемы. Однако мы все еще не знаем, являются ли балансы и сумма перевода отрицательными. К обязательству необходимо добавить еще одно доказательство того, что все ценности являются положительными.
